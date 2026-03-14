import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type CallDetailRecord = Database["public"]["Tables"]["call_detail_records"]["Row"];
type FraudAlert = Database["public"]["Tables"]["fraud_alerts"]["Row"];

export type RevenueAssuranceSnapshot = {
  summary: {
    revenueAtRisk: number;
    protectedRevenue: number;
    suspiciousExposure: number;
    blockedLossPrevention: number;
    highRiskRouteValue: number;
    alertToBlockConversion: number;
    resolvedCaseRatio: number;
    highRiskTrafficShare: number;
  };
  scenarioImpact: Array<{
    label: string;
    value: number;
  }>;
  routeImpact: Array<{
    label: string;
    value: number;
  }>;
  topExposureAlerts: Array<{
    id: string;
    title: string;
    sourceNumber: string;
    severity: string;
    exposure: number;
  }>;
  signalCards: Array<{
    title: string;
    value: string;
    description: string;
    tone: "cyan" | "amber" | "rose" | "emerald";
  }>;
};

export async function getRevenueAssuranceSnapshot(
  supabase: AppSupabaseClient,
): Promise<RevenueAssuranceSnapshot> {
  const [callsResult, alertsResult, blocksResult, casesResult] = await Promise.all([
    supabase.from("call_detail_records").select("*"),
    supabase.from("fraud_alerts").select("*"),
    supabase.from("blocked_numbers").select("*"),
    supabase.from("investigation_cases").select("*"),
  ]);

  throwIfError(callsResult.error, "Failed to fetch CDRs for revenue assurance.");
  throwIfError(alertsResult.error, "Failed to fetch alerts for revenue assurance.");
  throwIfError(blocksResult.error, "Failed to fetch blocks for revenue assurance.");
  throwIfError(casesResult.error, "Failed to fetch cases for revenue assurance.");

  const calls = callsResult.data ?? [];
  const alerts = alertsResult.data ?? [];
  const blocks = blocksResult.data ?? [];
  const cases = casesResult.data ?? [];

  const suspiciousCalls = calls.filter(isSuspicious);
  const revenueAtRisk = suspiciousCalls.reduce(
    (sum, call) => sum + estimateExposure(call),
    0,
  );
  const protectedRevenue = blocks
    .filter((block) => block.is_active)
    .reduce((sum, block) => {
      const relatedAlerts = alerts.filter((alert) => alert.source_number === block.phone_number);
      return sum + relatedAlerts.reduce((inner, alert) => inner + estimateAlertExposure(alert), 0);
    }, 0);
  const suspiciousExposure = suspiciousCalls.reduce(
    (sum, call) => sum + Number(call.cost),
    0,
  );
  const blockedLossPrevention = protectedRevenue * 0.7;
  const highRiskRouteValue = buildRouteExposure(calls)
    .filter((item) => item.value > 0)
    .slice(0, 5)
    .reduce((sum, item) => sum + item.value, 0);
  const alertToBlockConversion =
    alerts.length === 0 ? 0 : (blocks.filter((block) => block.is_active).length / alerts.length) * 100;
  const resolvedCaseRatio =
    cases.length === 0
      ? 0
      : (cases.filter((item) => item.status === "resolved").length / cases.length) * 100;
  const highRiskTrafficShare =
    calls.length === 0 ? 0 : (suspiciousCalls.length / calls.length) * 100;

  return {
    summary: {
      revenueAtRisk,
      protectedRevenue,
      suspiciousExposure,
      blockedLossPrevention,
      highRiskRouteValue,
      alertToBlockConversion,
      resolvedCaseRatio,
      highRiskTrafficShare,
    },
    scenarioImpact: buildScenarioImpact(suspiciousCalls),
    routeImpact: buildRouteExposure(calls),
    topExposureAlerts: buildTopExposureAlerts(alerts),
    signalCards: [
      {
        title: "Protected Revenue",
        value: formatCurrency(protectedRevenue),
        description: "Estimated value shielded by active containment actions and fraud response.",
        tone: "emerald",
      },
      {
        title: "Revenue At Risk",
        value: formatCurrency(revenueAtRisk),
        description: "Estimated exposure tied to suspicious CDR traffic still visible in the system.",
        tone: revenueAtRisk > protectedRevenue ? "rose" : "amber",
      },
      {
        title: "Alert-to-Block Conversion",
        value: `${alertToBlockConversion.toFixed(1)}%`,
        description: "Share of generated alerts that progressed into an active blocking response.",
        tone: "cyan",
      },
      {
        title: "Resolved Case Ratio",
        value: `${resolvedCaseRatio.toFixed(1)}%`,
        description: "Share of investigation cases that have reached documented resolution.",
        tone: "amber",
      },
    ],
  };
}

function buildScenarioImpact(calls: CallDetailRecord[]) {
  const map = new Map<string, number>();

  calls.forEach((call) => {
    const scenario = readScenario(call);
    map.set(scenario, (map.get(scenario) ?? 0) + estimateExposure(call));
  });

  return [...map.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value: roundMoney(value) }));
}

function buildRouteExposure(calls: CallDetailRecord[]) {
  const map = new Map<string, number>();

  calls.forEach((call) => {
    const route = `${call.source_country} -> ${call.destination_country}`;
    map.set(route, (map.get(route) ?? 0) + estimateExposure(call));
  });

  return [...map.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value: roundMoney(value) }));
}

function buildTopExposureAlerts(alerts: FraudAlert[]) {
  return alerts
    .map((alert) => ({
      id: alert.id,
      title: alert.title,
      sourceNumber: alert.source_number,
      severity: alert.severity,
      exposure: roundMoney(estimateAlertExposure(alert)),
    }))
    .sort((left, right) => right.exposure - left.exposure)
    .slice(0, 6);
}

function estimateExposure(call: CallDetailRecord) {
  const riskMultiplier = 1 + Number(call.risk_score) / 40;
  const suspiciousMultiplier = isSuspicious(call) ? 2.4 : 1;
  const routeMultiplier =
    call.source_country === call.destination_country ? 1 : 1.35;

  return Number(call.cost) * riskMultiplier * suspiciousMultiplier * routeMultiplier;
}

function estimateAlertExposure(alert: FraudAlert) {
  const severityMultiplier =
    alert.severity === "critical"
      ? 2.8
      : alert.severity === "high"
        ? 2.1
        : 1.4;

  return Number(alert.risk_score) * severityMultiplier;
}

function readScenario(call: CallDetailRecord) {
  const metadata = call.metadata;

  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "unknown";
  }

  const scenario = metadata.scenario;
  return typeof scenario === "string" ? scenario.replaceAll("_", " ") : "unknown";
}

function isSuspicious(call: CallDetailRecord) {
  return call.is_suspicious || Number(call.risk_score) >= 80;
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
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
