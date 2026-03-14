import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type CallDetailRecord = Database["public"]["Tables"]["call_detail_records"]["Row"];
type FraudAlert = Database["public"]["Tables"]["fraud_alerts"]["Row"];

export type NetworkSecuritySnapshot = {
  summary: {
    totalRoutes: number;
    highRiskRoutes: number;
    suspiciousTrafficShare: number;
    internationalRiskPairs: number;
  };
  routeRisks: Array<{
    id: string;
    sourceCountry: string;
    destinationCountry: string;
    totalCalls: number;
    suspiciousCalls: number;
    averageRisk: number;
    riskLevel: "low" | "medium" | "high" | "critical";
  }>;
  topology: {
    nodes: Array<{
      id: string;
      label: string;
      suspiciousVolume: number;
      totalVolume: number;
      riskLevel: "low" | "medium" | "high" | "critical";
    }>;
    links: Array<{
      id: string;
      source: string;
      target: string;
      totalCalls: number;
      suspiciousCalls: number;
      riskLevel: "low" | "medium" | "high" | "critical";
    }>;
  };
  securitySignals: Array<{
    title: string;
    value: string;
    tone: "cyan" | "amber" | "rose";
    description: string;
  }>;
  scenarioSignals: Array<{
    label: string;
    value: number;
  }>;
};

export async function getNetworkSecuritySnapshot(
  supabase: AppSupabaseClient,
): Promise<NetworkSecuritySnapshot> {
  const [callsResult, alertsResult] = await Promise.all([
    supabase
      .from("call_detail_records")
      .select("*")
      .order("call_start", { ascending: false }),
    supabase.from("fraud_alerts").select("*"),
  ]);

  throwIfError(callsResult.error, "Failed to fetch CDRs for route intelligence.");
  throwIfError(alertsResult.error, "Failed to fetch alerts for security signals.");

  const calls = callsResult.data ?? [];
  const alerts = alertsResult.data ?? [];

  const routeRisks = buildRouteRisks(calls);
  const suspiciousCalls = calls.filter(isSuspicious);

  return {
    summary: {
      totalRoutes: routeRisks.length,
      highRiskRoutes: routeRisks.filter((route) =>
        route.riskLevel === "high" || route.riskLevel === "critical",
      ).length,
      suspiciousTrafficShare:
        calls.length === 0 ? 0 : (suspiciousCalls.length / calls.length) * 100,
      internationalRiskPairs: routeRisks.filter(
        (route) =>
          route.sourceCountry !== route.destinationCountry &&
          (route.riskLevel === "high" || route.riskLevel === "critical"),
      ).length,
    },
    routeRisks,
    topology: buildTopology(routeRisks),
    securitySignals: buildSecuritySignals(calls, alerts, routeRisks),
    scenarioSignals: buildScenarioSignals(suspiciousCalls),
  };
}

function buildRouteRisks(calls: CallDetailRecord[]) {
  const routeMap = new Map<
    string,
    {
      sourceCountry: string;
      destinationCountry: string;
      totalCalls: number;
      suspiciousCalls: number;
      totalRisk: number;
    }
  >();

  calls.forEach((call) => {
    const key = `${call.source_country}->${call.destination_country}`;
    const existing = routeMap.get(key) ?? {
      sourceCountry: call.source_country,
      destinationCountry: call.destination_country,
      totalCalls: 0,
      suspiciousCalls: 0,
      totalRisk: 0,
    };

    existing.totalCalls += 1;
    existing.totalRisk += Number(call.risk_score);

    if (isSuspicious(call)) {
      existing.suspiciousCalls += 1;
    }

    routeMap.set(key, existing);
  });

  return [...routeMap.entries()]
    .map(([key, route]) => {
      const averageRisk = route.totalCalls === 0 ? 0 : route.totalRisk / route.totalCalls;
      return {
        id: key,
        sourceCountry: route.sourceCountry,
        destinationCountry: route.destinationCountry,
        totalCalls: route.totalCalls,
        suspiciousCalls: route.suspiciousCalls,
        averageRisk,
        riskLevel: getRiskLevel(averageRisk, route.suspiciousCalls / route.totalCalls),
      };
    })
    .sort((left, right) => {
      const rightScore = right.averageRisk + right.suspiciousCalls * 8;
      const leftScore = left.averageRisk + left.suspiciousCalls * 8;
      return rightScore - leftScore;
    });
}

function buildTopology(
  routeRisks: ReturnType<typeof buildRouteRisks>,
): NetworkSecuritySnapshot["topology"] {
  const nodeMap = new Map<
    string,
    {
      id: string;
      label: string;
      suspiciousVolume: number;
      totalVolume: number;
      weightedRisk: number;
    }
  >();

  routeRisks.forEach((route) => {
    const source = nodeMap.get(route.sourceCountry) ?? {
      id: route.sourceCountry,
      label: route.sourceCountry,
      suspiciousVolume: 0,
      totalVolume: 0,
      weightedRisk: 0,
    };
    const destination = nodeMap.get(route.destinationCountry) ?? {
      id: route.destinationCountry,
      label: route.destinationCountry,
      suspiciousVolume: 0,
      totalVolume: 0,
      weightedRisk: 0,
    };

    source.suspiciousVolume += route.suspiciousCalls;
    source.totalVolume += route.totalCalls;
    source.weightedRisk += route.averageRisk;
    destination.suspiciousVolume += route.suspiciousCalls;
    destination.totalVolume += route.totalCalls;
    destination.weightedRisk += route.averageRisk;

    nodeMap.set(source.id, source);
    nodeMap.set(destination.id, destination);
  });

  return {
    nodes: [...nodeMap.values()]
      .map((node) => ({
        id: node.id,
        label: node.label,
        suspiciousVolume: node.suspiciousVolume,
        totalVolume: node.totalVolume,
        riskLevel: getRiskLevel(
          node.totalVolume === 0 ? 0 : node.weightedRisk / Math.max(node.totalVolume / 2, 1),
          node.totalVolume === 0 ? 0 : node.suspiciousVolume / node.totalVolume,
        ),
      }))
      .sort((left, right) => right.suspiciousVolume - left.suspiciousVolume)
      .slice(0, 8),
    links: routeRisks.slice(0, 8).map((route) => ({
      id: route.id,
      source: route.sourceCountry,
      target: route.destinationCountry,
      totalCalls: route.totalCalls,
      suspiciousCalls: route.suspiciousCalls,
      riskLevel: route.riskLevel,
    })),
  };
}

function buildSecuritySignals(
  calls: CallDetailRecord[],
  alerts: FraudAlert[],
  routeRisks: ReturnType<typeof buildRouteRisks>,
): NetworkSecuritySnapshot["securitySignals"] {
  const suspiciousCalls = calls.filter(isSuspicious);
  const burstEvents = suspiciousCalls.filter(
    (call) => readScenario(call.metadata) === "burst_calls",
  ).length;
  const crossBorderHighRisk = routeRisks.filter(
    (route) =>
      route.sourceCountry !== route.destinationCountry &&
      (route.riskLevel === "high" || route.riskLevel === "critical"),
  ).length;
  const openCriticalAlerts = alerts.filter(
    (alert) => alert.status !== "resolved" && alert.severity === "critical",
  ).length;

  return [
    {
      title: "Route Abuse Exposure",
      value: String(crossBorderHighRisk),
      tone: crossBorderHighRisk > 0 ? "rose" : "cyan",
      description:
        "International pairs with elevated suspicious concentration, useful for SIM box and interconnect abuse demos.",
    },
    {
      title: "Burst Calling Signal",
      value: String(burstEvents),
      tone: burstEvents > 0 ? "amber" : "cyan",
      description:
        "Compressed short-call activity that suggests automated fraud or PBX compromise.",
    },
    {
      title: "Critical Open Incidents",
      value: String(openCriticalAlerts),
      tone: openCriticalAlerts > 0 ? "rose" : "cyan",
      description:
        "Unresolved alerts still demanding analyst attention across the telecom surface.",
    },
  ];
}

function buildScenarioSignals(calls: CallDetailRecord[]) {
  const scenarioMap = new Map<string, number>();

  calls.forEach((call) => {
    const scenario = readScenario(call.metadata);
    scenarioMap.set(scenario, (scenarioMap.get(scenario) ?? 0) + 1);
  });

  return [...scenarioMap.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label: label.replaceAll("_", " "), value }));
}

function readScenario(metadata: Json) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "unknown";
  }

  const scenario = metadata.scenario;
  return typeof scenario === "string" ? scenario : "unknown";
}

function isSuspicious(call: CallDetailRecord) {
  return call.is_suspicious || Number(call.risk_score) >= 80;
}

function getRiskLevel(
  averageRisk: number,
  suspiciousRatio: number,
): "low" | "medium" | "high" | "critical" {
  if (averageRisk >= 90 || suspiciousRatio >= 0.8) {
    return "critical";
  }
  if (averageRisk >= 75 || suspiciousRatio >= 0.5) {
    return "high";
  }
  if (averageRisk >= 45 || suspiciousRatio >= 0.2) {
    return "medium";
  }
  return "low";
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
