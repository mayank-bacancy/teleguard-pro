import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type CaseRow = Database["public"]["Tables"]["investigation_cases"]["Row"];
type CaseInsert = Database["public"]["Tables"]["investigation_cases"]["Insert"];
type CaseNoteRow = Database["public"]["Tables"]["case_notes"]["Row"];
type AlertRow = Database["public"]["Tables"]["fraud_alerts"]["Row"];

export type CaseListItem = {
  id: string;
  title: string;
  ownerName: string;
  status: string;
  priority: string;
  updatedAt: string;
  linkedAlertId: string;
  linkedAlertTitle: string | null;
};

export type CasesPageData = {
  counts: {
    total: number;
    open: number;
    inReview: number;
    resolved: number;
  };
  cases: CaseListItem[];
};

export type CaseDetail = {
  caseItem: CaseRow;
  alert: AlertRow | null;
  notes: CaseNoteRow[];
};

export async function getCasesPageData(
  supabase: AppSupabaseClient,
): Promise<CasesPageData> {
  const [casesResult, totalResult, openResult, reviewResult, resolvedResult] =
    await Promise.all([
      supabase
        .from("investigation_cases")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase
        .from("investigation_cases")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("investigation_cases")
        .select("*", { count: "exact", head: true })
        .eq("status", "open"),
      supabase
        .from("investigation_cases")
        .select("*", { count: "exact", head: true })
        .eq("status", "in_review"),
      supabase
        .from("investigation_cases")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved"),
    ]);

  throwIfError(casesResult.error, "Failed to fetch investigation cases.");
  throwIfError(totalResult.error, "Failed to count investigation cases.");
  throwIfError(openResult.error, "Failed to count open cases.");
  throwIfError(reviewResult.error, "Failed to count in-review cases.");
  throwIfError(resolvedResult.error, "Failed to count resolved cases.");

  const cases = casesResult.data ?? [];
  const alertIds = cases.map((item) => item.alert_id);
  const alertsResult =
    alertIds.length === 0
      ? { data: [] as AlertRow[], error: null }
      : await supabase.from("fraud_alerts").select("*").in("id", alertIds);

  throwIfError(alertsResult.error, "Failed to fetch linked alerts for cases.");

  const alertMap = new Map((alertsResult.data ?? []).map((alert) => [alert.id, alert]));

  return {
    counts: {
      total: totalResult.count ?? 0,
      open: openResult.count ?? 0,
      inReview: reviewResult.count ?? 0,
      resolved: resolvedResult.count ?? 0,
    },
    cases: cases.map((item) => ({
      id: item.id,
      title: item.title,
      ownerName: item.owner_name,
      status: item.status,
      priority: item.priority,
      updatedAt: item.updated_at,
      linkedAlertId: item.alert_id,
      linkedAlertTitle: alertMap.get(item.alert_id)?.title ?? null,
    })),
  };
}

export async function getCaseDetail(
  supabase: AppSupabaseClient,
  caseId: string,
): Promise<CaseDetail | null> {
  const caseResult = await supabase
    .from("investigation_cases")
    .select("*")
    .eq("id", caseId)
    .maybeSingle();

  throwIfError(caseResult.error, "Failed to fetch case detail.");

  const caseItem = caseResult.data;

  if (!caseItem) {
    return null;
  }

  const [alertResult, notesResult] = await Promise.all([
    supabase
      .from("fraud_alerts")
      .select("*")
      .eq("id", caseItem.alert_id)
      .maybeSingle(),
    supabase
      .from("case_notes")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: false }),
  ]);

  throwIfError(alertResult.error, "Failed to fetch linked alert.");
  throwIfError(notesResult.error, "Failed to fetch case notes.");

  return {
    caseItem,
    alert: alertResult.data,
    notes: notesResult.data ?? [],
  };
}

export async function getCaseByAlertId(
  supabase: AppSupabaseClient,
  alertId: string,
) {
  const result = await supabase
    .from("investigation_cases")
    .select("*")
    .eq("alert_id", alertId)
    .maybeSingle();

  throwIfError(result.error, "Failed to fetch case by alert.");
  return result.data;
}

export async function createCaseFromAlert(
  supabase: AppSupabaseClient,
  alertId: string,
) {
  const existing = await getCaseByAlertId(supabase, alertId);

  if (existing) {
    return existing;
  }

  const alertResult = await supabase
    .from("fraud_alerts")
    .select("*")
    .eq("id", alertId)
    .single();

  throwIfError(alertResult.error, "Failed to fetch alert for case creation.");

  const alert = alertResult.data;

  if (!alert) {
    throw new Error("Alert not found for case creation.");
  }

  const payload: CaseInsert = {
    alert_id: alert.id,
    title: `${alert.title} Case`,
    owner_name: "Fraud Analyst",
    status: "open",
    priority: mapAlertSeverityToPriority(alert.severity),
    summary: alert.reason,
  };

  const inserted = await supabase
    .from("investigation_cases")
    .insert(payload)
    .select("*")
    .single();

  throwIfError(inserted.error, "Failed to create investigation case.");

  if (!inserted.data) {
    throw new Error("Investigation case was not returned after creation.");
  }

  return inserted.data;
}

export async function addCaseNote(
  supabase: AppSupabaseClient,
  caseId: string,
  note: string,
  authorName: string,
) {
  const result = await supabase
    .from("case_notes")
    .insert({
      case_id: caseId,
      note,
      author_name: authorName,
    })
    .select("id")
    .single();

  throwIfError(result.error, "Failed to add case note.");
}

export async function updateCaseStatus(
  supabase: AppSupabaseClient,
  caseId: string,
  status: "open" | "in_review" | "resolved",
) {
  const result = await supabase
    .from("investigation_cases")
    .update({ status })
    .eq("id", caseId)
    .select("id")
    .single();

  throwIfError(result.error, "Failed to update case status.");
}

function mapAlertSeverityToPriority(severity: string) {
  switch (severity) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    default:
      return "low";
  }
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
