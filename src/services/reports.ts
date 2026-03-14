import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type InvestigationCase = Database["public"]["Tables"]["investigation_cases"]["Row"];
type CaseNote = Database["public"]["Tables"]["case_notes"]["Row"];

export type ReportsSnapshot = {
  summary: {
    alerts: number;
    blockedNumbers: number;
    cases: number;
    protectedRevenueEstimate: number;
    suspiciousTrafficShare: number;
  };
  exports: Array<{
    title: string;
    description: string;
    href: string;
  }>;
  executiveHighlights: Array<{
    label: string;
    value: string;
  }>;
  topCases: Array<{
    id: string;
    title: string;
    ownerName: string;
    status: string;
    noteCount: number;
  }>;
};

export async function getReportsSnapshot(
  supabase: AppSupabaseClient,
): Promise<ReportsSnapshot> {
  const [alertsResult, blocksResult, casesResult, notesResult, callsResult] =
    await Promise.all([
      supabase.from("fraud_alerts").select("*").order("created_at", { ascending: false }),
      supabase.from("blocked_numbers").select("*").order("blocked_at", { ascending: false }),
      supabase
        .from("investigation_cases")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase.from("case_notes").select("*"),
      supabase.from("call_detail_records").select("*"),
    ]);

  throwIfError(alertsResult.error, "Failed to fetch alerts for reporting.");
  throwIfError(blocksResult.error, "Failed to fetch blocked numbers for reporting.");
  throwIfError(casesResult.error, "Failed to fetch cases for reporting.");
  throwIfError(notesResult.error, "Failed to fetch case notes for reporting.");
  throwIfError(callsResult.error, "Failed to fetch CDRs for reporting.");

  const alerts = alertsResult.data ?? [];
  const blocks = blocksResult.data ?? [];
  const cases = casesResult.data ?? [];
  const notes = notesResult.data ?? [];
  const calls = callsResult.data ?? [];

  const suspiciousCalls = calls.filter(
    (call) => call.is_suspicious || Number(call.risk_score) >= 80,
  );
  const protectedRevenueEstimate = blocks
    .filter((block) => block.is_active)
    .reduce((sum, block) => {
      const relatedAlerts = alerts.filter((alert) => alert.source_number === block.phone_number);
      return sum + relatedAlerts.reduce((inner, alert) => inner + Number(alert.risk_score), 0);
    }, 0);

  return {
    summary: {
      alerts: alerts.length,
      blockedNumbers: blocks.filter((block) => block.is_active).length,
      cases: cases.length,
      protectedRevenueEstimate,
      suspiciousTrafficShare:
        calls.length === 0 ? 0 : (suspiciousCalls.length / calls.length) * 100,
    },
    exports: [
      {
        title: "Fraud Alerts CSV",
        description: "Full incident queue with severity, status, and source numbers.",
        href: "/api/reports/alerts.csv",
      },
      {
        title: "Cases CSV",
        description: "Investigation ownership, status, and linked alert records.",
        href: "/api/reports/cases.csv",
      },
      {
        title: "Blocked Numbers CSV",
        description: "Containment actions, reasons, and current block state.",
        href: "/api/reports/blocked-numbers.csv",
      },
    ],
    executiveHighlights: [
      { label: "Alerts tracked", value: String(alerts.length) },
      {
        label: "Active blocked numbers",
        value: String(blocks.filter((block) => block.is_active).length),
      },
      {
        label: "Protected revenue estimate",
        value: formatCurrency(protectedRevenueEstimate),
      },
      {
        label: "Suspicious traffic share",
        value: `${(
          calls.length === 0 ? 0 : (suspiciousCalls.length / calls.length) * 100
        ).toFixed(1)}%`,
      },
    ],
    topCases: buildTopCases(cases, notes),
  };
}

export async function getAlertsReportRows(supabase: AppSupabaseClient) {
  const result = await supabase
    .from("fraud_alerts")
    .select("*")
    .order("created_at", { ascending: false });

  throwIfError(result.error, "Failed to fetch alerts report data.");
  return result.data ?? [];
}

export async function getCasesReportRows(supabase: AppSupabaseClient) {
  const [casesResult, notesResult] = await Promise.all([
    supabase
      .from("investigation_cases")
      .select("*")
      .order("updated_at", { ascending: false }),
    supabase.from("case_notes").select("*"),
  ]);

  throwIfError(casesResult.error, "Failed to fetch cases report data.");
  throwIfError(notesResult.error, "Failed to fetch case notes report data.");

  const notesByCase = new Map<string, number>();
  (notesResult.data ?? []).forEach((note) => {
    notesByCase.set(note.case_id, (notesByCase.get(note.case_id) ?? 0) + 1);
  });

  return (casesResult.data ?? []).map((caseItem) => ({
    ...caseItem,
    notes_count: notesByCase.get(caseItem.id) ?? 0,
  }));
}

export async function getBlockedNumbersReportRows(
  supabase: AppSupabaseClient,
) {
  const result = await supabase
    .from("blocked_numbers")
    .select("*")
    .order("blocked_at", { ascending: false });

  throwIfError(result.error, "Failed to fetch blocked numbers report data.");
  return result.data ?? [];
}

function buildTopCases(cases: InvestigationCase[], notes: CaseNote[]) {
  const noteCounts = new Map<string, number>();

  notes.forEach((note) => {
    noteCounts.set(note.case_id, (noteCounts.get(note.case_id) ?? 0) + 1);
  });

  return cases.slice(0, 5).map((caseItem) => ({
    id: caseItem.id,
    title: caseItem.title,
    ownerName: caseItem.owner_name,
    status: caseItem.status,
    noteCount: noteCounts.get(caseItem.id) ?? 0,
  }));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
