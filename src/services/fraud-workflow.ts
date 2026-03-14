import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type CallDetailRecord = Database["public"]["Tables"]["call_detail_records"]["Row"];
type FraudAlertInsert = Database["public"]["Tables"]["fraud_alerts"]["Insert"];
type BlockedNumberInsert = Database["public"]["Tables"]["blocked_numbers"]["Insert"];
type FraudRule = Database["public"]["Tables"]["fraud_rules"]["Row"];

export type DashboardSnapshot = {
  counts: {
    totalCalls: number;
    suspiciousCalls: number;
    alerts: number;
    blockedNumbers: number;
  };
  recentCalls: CallDetailRecord[];
  recentAlerts: Array<{
    id: string;
    title: string;
    severity: string;
    reason: string;
    sourceNumber: string;
    status: string;
    createdAt: string;
    riskScore: number;
  }>;
  activeRules: Array<{
    id: string;
    name: string;
    ruleType: string;
    severity: string;
    thresholdValue: number | null;
  }>;
};

export type FraudWorkflowResult = {
  alertsCreated: number;
  numbersBlocked: number;
  scannedCalls: number;
};

export async function getDashboardSnapshot(
  supabase: AppSupabaseClient,
): Promise<DashboardSnapshot> {
  const [
    totalCallsResult,
    suspiciousCallsResult,
    alertsResult,
    blockedNumbersResult,
    recentCallsResult,
    recentAlertsResult,
    activeRulesResult,
  ] = await Promise.all([
    supabase
      .from("call_detail_records")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("call_detail_records")
      .select("*", { count: "exact", head: true })
      .or("is_suspicious.eq.true,risk_score.gte.80"),
    supabase.from("fraud_alerts").select("*", { count: "exact", head: true }),
    supabase
      .from("blocked_numbers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("call_detail_records")
      .select("*")
      .order("call_start", { ascending: false })
      .limit(8),
    supabase
      .from("fraud_alerts")
      .select("id, title, severity, reason, source_number, status, created_at, risk_score")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("fraud_rules")
      .select("id, name, rule_type, severity, threshold_value")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  throwIfError(totalCallsResult.error, "Failed to count call detail records.");
  throwIfError(
    suspiciousCallsResult.error,
    "Failed to count suspicious call detail records.",
  );
  throwIfError(alertsResult.error, "Failed to count fraud alerts.");
  throwIfError(blockedNumbersResult.error, "Failed to count blocked numbers.");
  throwIfError(recentCallsResult.error, "Failed to fetch recent call records.");
  throwIfError(recentAlertsResult.error, "Failed to fetch recent fraud alerts.");
  throwIfError(activeRulesResult.error, "Failed to fetch fraud rules.");

  return {
    counts: {
      totalCalls: totalCallsResult.count ?? 0,
      suspiciousCalls: suspiciousCallsResult.count ?? 0,
      alerts: alertsResult.count ?? 0,
      blockedNumbers: blockedNumbersResult.count ?? 0,
    },
    recentCalls: recentCallsResult.data ?? [],
    recentAlerts:
      recentAlertsResult.data?.map((alert) => ({
        id: alert.id,
        title: alert.title,
        severity: alert.severity,
        reason: alert.reason,
        sourceNumber: alert.source_number,
        status: alert.status,
        createdAt: alert.created_at,
        riskScore: alert.risk_score,
      })) ?? [],
    activeRules:
      activeRulesResult.data?.map((rule) => ({
        id: rule.id,
        name: rule.name,
        ruleType: rule.rule_type,
        severity: rule.severity,
        thresholdValue: rule.threshold_value,
      })) ?? [],
  };
}

export async function runFraudWorkflow(
  supabase: AppSupabaseClient,
): Promise<FraudWorkflowResult> {
  const suspiciousCallsResult = await supabase
    .from("call_detail_records")
    .select("*")
    .or("is_suspicious.eq.true,risk_score.gte.80")
    .order("call_start", { ascending: false })
    .limit(50);

  throwIfError(
    suspiciousCallsResult.error,
    "Failed to load suspicious call records.",
  );

  const suspiciousCalls = suspiciousCallsResult.data ?? [];

  if (suspiciousCalls.length === 0) {
    return {
      alertsCreated: 0,
      numbersBlocked: 0,
      scannedCalls: 0,
    };
  }

  const cdrIds = suspiciousCalls.map((cdr) => cdr.id);

  const [existingAlertsResult, rulesResult] = await Promise.all([
    supabase.from("fraud_alerts").select("cdr_id").in("cdr_id", cdrIds),
    supabase.from("fraud_rules").select("*").eq("is_active", true),
  ]);

  throwIfError(
    existingAlertsResult.error,
    "Failed to load existing alerts for suspicious calls.",
  );
  throwIfError(rulesResult.error, "Failed to load active fraud rules.");

  const existingAlertCdrIds = new Set(
    (existingAlertsResult.data ?? [])
      .map((item) => item.cdr_id)
      .filter((value): value is string => Boolean(value)),
  );

  const ruleMap = new Map(
    (rulesResult.data ?? []).map((rule) => [rule.rule_type, rule]),
  );

  const newAlerts = suspiciousCalls
    .filter((cdr) => !existingAlertCdrIds.has(cdr.id))
    .map((cdr) => buildAlertInsert(cdr, ruleMap));

  if (newAlerts.length === 0) {
    return {
      alertsCreated: 0,
      numbersBlocked: 0,
      scannedCalls: suspiciousCalls.length,
    };
  }

  const insertedAlertsResult = await supabase
    .from("fraud_alerts")
    .insert(newAlerts)
    .select("id, source_number, risk_score, reason, rule_id");

  throwIfError(insertedAlertsResult.error, "Failed to create fraud alerts.");

  const highRiskAlerts = insertedAlertsResult.data?.filter(
    (alert) => alert.risk_score >= 90,
  );

  const blocks = dedupeBlocks(
    highRiskAlerts?.map(
      (alert): BlockedNumberInsert => ({
        phone_number: alert.source_number,
        reason: alert.reason,
        source_alert_id: alert.id,
        blocked_by_rule_id: alert.rule_id,
        is_active: true,
      }),
    ) ?? [],
  );

  let numbersBlocked = 0;

  if (blocks.length > 0) {
    const blockedResult = await supabase
      .from("blocked_numbers")
      .upsert(blocks, { onConflict: "phone_number" })
      .select("id");

    throwIfError(blockedResult.error, "Failed to upsert blocked numbers.");
    numbersBlocked = blockedResult.data?.length ?? 0;
  }

  return {
    alertsCreated: insertedAlertsResult.data?.length ?? 0,
    numbersBlocked,
    scannedCalls: suspiciousCalls.length,
  };
}

function buildAlertInsert(
  cdr: CallDetailRecord,
  ruleMap: Map<string, FraudRule>,
): FraudAlertInsert {
  const scenario = readScenario(cdr.metadata);
  const matchedRuleType = getRuleTypeForScenario(scenario, cdr);
  const matchedRule = matchedRuleType ? ruleMap.get(matchedRuleType) : undefined;
  const severity = matchedRule?.severity ?? getSeverityFromRisk(cdr.risk_score);

  return {
    title: getAlertTitle(scenario, cdr),
    description: getAlertDescription(scenario, cdr),
    severity,
    status: "open",
    reason: getAlertReason(scenario, cdr),
    risk_score: cdr.risk_score,
    cdr_id: cdr.id,
    rule_id: matchedRule?.id ?? null,
    source_number: cdr.caller_number,
  };
}

function getRuleTypeForScenario(
  scenario: string | null,
  cdr: CallDetailRecord,
): string | null {
  if (scenario === "burst_calls") {
    return "burst_calls";
  }

  if (scenario === "multi_country") {
    return "country_spread";
  }

  if (scenario === "high_duration" || cdr.duration_seconds >= 1800) {
    return "duration_spike";
  }

  return null;
}

function readScenario(metadata: Json): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  const scenario = metadata.scenario;
  return typeof scenario === "string" ? scenario : null;
}

function getAlertTitle(scenario: string | null, cdr: CallDetailRecord) {
  switch (scenario) {
    case "burst_calls":
      return "Burst Call Pattern Detected";
    case "multi_country":
      return "Multi-Country Routing Anomaly";
    case "high_duration":
      return "High Duration Usage Detected";
    default:
      return cdr.risk_score >= 90
        ? "Critical Telecom Fraud Signal"
        : "Suspicious Telecom Activity";
  }
}

function getAlertDescription(scenario: string | null, cdr: CallDetailRecord) {
  switch (scenario) {
    case "burst_calls":
      return `Repeated short calls were detected from ${cdr.caller_number} across a compressed time window.`;
    case "multi_country":
      return `${cdr.caller_number} placed calls across multiple countries in a short interval, suggesting route abuse.`;
    case "high_duration":
      return `${cdr.caller_number} exceeded the expected duration threshold with a ${cdr.duration_seconds}-second call.`;
    default:
      return `${cdr.caller_number} exceeded the suspicious activity threshold with a risk score of ${cdr.risk_score}.`;
  }
}

function getAlertReason(scenario: string | null, cdr: CallDetailRecord) {
  switch (scenario) {
    case "burst_calls":
      return "High-volume burst calling detected within a short period.";
    case "multi_country":
      return "Caller reached multiple international destinations too quickly.";
    case "high_duration":
      return "Call duration exceeded the configured high-risk threshold.";
    default:
      return `CDR flagged due to suspicious indicator set and risk score ${cdr.risk_score}.`;
  }
}

function getSeverityFromRisk(riskScore: number) {
  if (riskScore >= 90) {
    return "critical";
  }

  if (riskScore >= 80) {
    return "high";
  }

  return "medium";
}

function dedupeBlocks(blocks: BlockedNumberInsert[]) {
  const map = new Map<string, BlockedNumberInsert>();

  blocks.forEach((block) => {
    if (!map.has(block.phone_number)) {
      map.set(block.phone_number, block);
    }
  });

  return [...map.values()];
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
