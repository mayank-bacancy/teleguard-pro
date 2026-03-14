import { format } from "date-fns";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type CallDetailRecord = Database["public"]["Tables"]["call_detail_records"]["Row"];
type FraudAlert = Database["public"]["Tables"]["fraud_alerts"]["Row"];
type BlockedNumber = Database["public"]["Tables"]["blocked_numbers"]["Row"];

export type AnalyticsSnapshot = {
  summary: {
    totalCalls: number;
    suspiciousCalls: number;
    suspiciousRate: number;
    totalAlerts: number;
    activeBlocks: number;
    averageRiskScore: number;
    containmentCoverage: number;
    openAlerts: number;
    resolvedAlerts: number;
  };
  trends: Array<{
    bucket: string;
    calls: number;
    suspicious: number;
    alerts: number;
    blocks: number;
  }>;
  severityDistribution: Array<{
    label: string;
    value: number;
  }>;
  scenarioDistribution: Array<{
    label: string;
    value: number;
  }>;
  routeDistribution: Array<{
    label: string;
    value: number;
  }>;
};

export async function getAnalyticsSnapshot(
  supabase: AppSupabaseClient,
): Promise<AnalyticsSnapshot> {
  const [callsResult, alertsResult, blocksResult] = await Promise.all([
    supabase
      .from("call_detail_records")
      .select("*")
      .order("call_start", { ascending: true }),
    supabase.from("fraud_alerts").select("*").order("created_at", {
      ascending: true,
    }),
    supabase.from("blocked_numbers").select("*").order("blocked_at", {
      ascending: true,
    }),
  ]);

  throwIfError(callsResult.error, "Failed to fetch call analytics.");
  throwIfError(alertsResult.error, "Failed to fetch alert analytics.");
  throwIfError(blocksResult.error, "Failed to fetch block analytics.");

  const calls = callsResult.data ?? [];
  const alerts = alertsResult.data ?? [];
  const blocks = blocksResult.data ?? [];

  return {
    summary: buildSummary(calls, alerts, blocks),
    trends: buildTrends(calls, alerts, blocks),
    severityDistribution: buildSeverityDistribution(alerts),
    scenarioDistribution: buildScenarioDistribution(calls),
    routeDistribution: buildRouteDistribution(calls),
  };
}

function buildSummary(
  calls: CallDetailRecord[],
  alerts: FraudAlert[],
  blocks: BlockedNumber[],
) {
  const suspiciousCalls = calls.filter(
    (call) => call.is_suspicious || call.risk_score >= 80,
  ).length;
  const activeBlocks = blocks.filter((block) => block.is_active).length;
  const openAlerts = alerts.filter((alert) => alert.status === "open").length;
  const resolvedAlerts = alerts.filter(
    (alert) => alert.status === "resolved",
  ).length;
  const averageRiskScore =
    calls.length === 0
      ? 0
      : calls.reduce((sum, call) => sum + Number(call.risk_score), 0) /
        calls.length;

  return {
    totalCalls: calls.length,
    suspiciousCalls,
    suspiciousRate:
      calls.length === 0 ? 0 : (suspiciousCalls / calls.length) * 100,
    totalAlerts: alerts.length,
    activeBlocks,
    averageRiskScore,
    containmentCoverage:
      alerts.length === 0 ? 0 : (activeBlocks / alerts.length) * 100,
    openAlerts,
    resolvedAlerts,
  };
}

function buildTrends(
  calls: CallDetailRecord[],
  alerts: FraudAlert[],
  blocks: BlockedNumber[],
) {
  const buckets = new Map<
    string,
    { bucket: string; calls: number; suspicious: number; alerts: number; blocks: number }
  >();

  calls.forEach((call) => {
    const key = toHourBucket(call.call_start);
    const bucket = getOrCreateBucket(buckets, key);
    bucket.calls += 1;
    if (call.is_suspicious || call.risk_score >= 80) {
      bucket.suspicious += 1;
    }
  });

  alerts.forEach((alert) => {
    const key = toHourBucket(alert.created_at);
    const bucket = getOrCreateBucket(buckets, key);
    bucket.alerts += 1;
  });

  blocks.forEach((block) => {
    const key = toHourBucket(block.blocked_at);
    const bucket = getOrCreateBucket(buckets, key);
    bucket.blocks += 1;
  });

  return [...buckets.values()].sort((left, right) =>
    left.bucket.localeCompare(right.bucket),
  );
}

function buildSeverityDistribution(alerts: FraudAlert[]) {
  return aggregateTopCounts(
    alerts.map((alert) => alert.severity || "unknown"),
    4,
  );
}

function buildScenarioDistribution(calls: CallDetailRecord[]) {
  const suspiciousCalls = calls.filter(
    (call) => call.is_suspicious || call.risk_score >= 80,
  );

  return aggregateTopCounts(
    suspiciousCalls.map((call) => readScenario(call.metadata)),
    5,
  );
}

function buildRouteDistribution(calls: CallDetailRecord[]) {
  return aggregateTopCounts(
    calls.map((call) => `${call.source_country} -> ${call.destination_country}`),
    5,
  );
}

function aggregateTopCounts(values: string[], limit: number) {
  const map = new Map<string, number>();

  values.forEach((value) => {
    map.set(value, (map.get(value) ?? 0) + 1);
  });

  return [...map.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function toHourBucket(timestamp: string) {
  return format(new Date(timestamp), "MMM d HH:00");
}

function getOrCreateBucket(
  buckets: Map<
    string,
    { bucket: string; calls: number; suspicious: number; alerts: number; blocks: number }
  >,
  key: string,
) {
  const existing = buckets.get(key);

  if (existing) {
    return existing;
  }

  const created = {
    bucket: key,
    calls: 0,
    suspicious: 0,
    alerts: 0,
    blocks: 0,
  };

  buckets.set(key, created);
  return created;
}

function readScenario(metadata: Json) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "unknown";
  }

  const scenario = metadata.scenario;
  return typeof scenario === "string" ? scenario.replaceAll("_", " ") : "unknown";
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
