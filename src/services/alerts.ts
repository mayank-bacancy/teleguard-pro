import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type FraudAlert = Database["public"]["Tables"]["fraud_alerts"]["Row"];
type CallDetailRecord = Database["public"]["Tables"]["call_detail_records"]["Row"];
type FraudRule = Database["public"]["Tables"]["fraud_rules"]["Row"];
type BlockedNumber = Database["public"]["Tables"]["blocked_numbers"]["Row"];

export type AlertFilters = {
  status: string;
  severity: string;
};

export type AlertListItem = {
  id: string;
  title: string;
  severity: string;
  status: string;
  sourceNumber: string;
  riskScore: number;
  reason: string;
  createdAt: string;
  blocked: boolean;
};

export type AlertsPageData = {
  filters: AlertFilters;
  counts: {
    total: number;
    open: number;
    acknowledged: number;
    resolved: number;
    critical: number;
  };
  alerts: AlertListItem[];
};

export type AlertInvestigation = {
  alert: FraudAlert;
  cdr: CallDetailRecord | null;
  rule: FraudRule | null;
  blockedNumber: BlockedNumber | null;
};

export async function getAlertsPageData(
  supabase: AppSupabaseClient,
  rawFilters: Partial<AlertFilters>,
): Promise<AlertsPageData> {
  const filters = normalizeFilters(rawFilters);

  const alertsQuery = supabase
    .from("fraud_alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.status !== "all") {
    alertsQuery.eq("status", filters.status);
  }

  if (filters.severity !== "all") {
    alertsQuery.eq("severity", filters.severity);
  }

  const [
    alertsResult,
    totalResult,
    openResult,
    acknowledgedResult,
    resolvedResult,
    criticalResult,
  ] = await Promise.all([
    alertsQuery,
    supabase.from("fraud_alerts").select("*", { count: "exact", head: true }),
    supabase
      .from("fraud_alerts")
      .select("*", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("fraud_alerts")
      .select("*", { count: "exact", head: true })
      .eq("status", "acknowledged"),
    supabase
      .from("fraud_alerts")
      .select("*", { count: "exact", head: true })
      .eq("status", "resolved"),
    supabase
      .from("fraud_alerts")
      .select("*", { count: "exact", head: true })
      .eq("severity", "critical"),
  ]);

  throwIfError(alertsResult.error, "Failed to fetch fraud alerts.");
  throwIfError(totalResult.error, "Failed to count fraud alerts.");
  throwIfError(openResult.error, "Failed to count open fraud alerts.");
  throwIfError(
    acknowledgedResult.error,
    "Failed to count acknowledged fraud alerts.",
  );
  throwIfError(resolvedResult.error, "Failed to count resolved fraud alerts.");
  throwIfError(criticalResult.error, "Failed to count critical fraud alerts.");

  const alerts = alertsResult.data ?? [];
  const alertIds = alerts.map((alert) => alert.id);

  const blockedNumbersResult =
    alertIds.length === 0
      ? { data: [] as Pick<BlockedNumber, "source_alert_id">[], error: null }
      : await supabase
          .from("blocked_numbers")
          .select("source_alert_id")
          .in("source_alert_id", alertIds)
          .eq("is_active", true);

  throwIfError(
    blockedNumbersResult.error,
    "Failed to load blocked number state for alerts.",
  );

  const blockedAlertIds = new Set(
    (blockedNumbersResult.data ?? [])
      .map((blocked) => blocked.source_alert_id)
      .filter((value): value is string => Boolean(value)),
  );

  return {
    filters,
    counts: {
      total: totalResult.count ?? 0,
      open: openResult.count ?? 0,
      acknowledged: acknowledgedResult.count ?? 0,
      resolved: resolvedResult.count ?? 0,
      critical: criticalResult.count ?? 0,
    },
    alerts: alerts.map((alert) => ({
      id: alert.id,
      title: alert.title,
      severity: alert.severity,
      status: alert.status,
      sourceNumber: alert.source_number,
      riskScore: alert.risk_score,
      reason: alert.reason,
      createdAt: alert.created_at,
      blocked: blockedAlertIds.has(alert.id),
    })),
  };
}

export async function getAlertInvestigation(
  supabase: AppSupabaseClient,
  alertId: string,
): Promise<AlertInvestigation | null> {
  const alertResult = await supabase
    .from("fraud_alerts")
    .select("*")
    .eq("id", alertId)
    .maybeSingle();

  throwIfError(alertResult.error, "Failed to fetch the requested fraud alert.");

  const alert = alertResult.data;

  if (!alert) {
    return null;
  }

  const [cdrResult, ruleResult, blockedResult] = await Promise.all([
    alert.cdr_id
      ? supabase
          .from("call_detail_records")
          .select("*")
          .eq("id", alert.cdr_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    alert.rule_id
      ? supabase
          .from("fraud_rules")
          .select("*")
          .eq("id", alert.rule_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("blocked_numbers")
      .select("*")
      .eq("source_alert_id", alert.id)
      .maybeSingle(),
  ]);

  throwIfError(cdrResult.error, "Failed to fetch related call record.");
  throwIfError(ruleResult.error, "Failed to fetch related fraud rule.");
  throwIfError(blockedResult.error, "Failed to fetch block status.");

  return {
    alert,
    cdr: cdrResult.data,
    rule: ruleResult.data,
    blockedNumber: blockedResult.data,
  };
}

export async function updateAlertStatus(
  supabase: AppSupabaseClient,
  alertId: string,
  status: "open" | "acknowledged" | "resolved",
) {
  const now = new Date().toISOString();

  const update: Database["public"]["Tables"]["fraud_alerts"]["Update"] = {
    status,
  };

  if (status === "open") {
    update.acknowledged_at = null;
    update.resolved_at = null;
  }

  if (status === "acknowledged") {
    update.acknowledged_at = now;
    update.resolved_at = null;
  }

  if (status === "resolved") {
    update.acknowledged_at = now;
    update.resolved_at = now;
  }

  const result = await supabase
    .from("fraud_alerts")
    .update(update)
    .eq("id", alertId)
    .select("id")
    .single();

  throwIfError(result.error, "Failed to update alert status.");
}

function normalizeFilters(rawFilters: Partial<AlertFilters>): AlertFilters {
  const allowedStatuses = new Set(["all", "open", "acknowledged", "resolved"]);
  const allowedSeverities = new Set(["all", "medium", "high", "critical"]);

  return {
    status: allowedStatuses.has(rawFilters.status ?? "")
      ? (rawFilters.status as string)
      : "all",
    severity: allowedSeverities.has(rawFilters.severity ?? "")
      ? (rawFilters.severity as string)
      : "all",
  };
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
