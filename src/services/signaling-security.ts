import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type FraudAlert = Database["public"]["Tables"]["fraud_alerts"]["Row"];
type InvestigationCase = Database["public"]["Tables"]["investigation_cases"]["Row"];

export type SignalingIncident = {
  id: string;
  incidentType: string;
  severity: "medium" | "high" | "critical";
  sourceNetwork: string;
  targetElement: string;
  status: "open" | "investigating" | "contained";
  description: string;
  createdAt: string;
  relatedAlertId?: string;
  relatedCaseId?: string;
};

export type SignalingSecuritySnapshot = {
  summary: {
    totalIncidents: number;
    criticalIncidents: number;
    activeAnomalies: number;
    suspiciousLocationRequests: number;
  };
  incidents: SignalingIncident[];
  severityMix: Array<{
    label: string;
    value: number;
  }>;
  targetElements: Array<{
    label: string;
    value: number;
  }>;
  suspiciousNetworks: Array<{
    label: string;
    value: number;
  }>;
  responseSignals: Array<{
    title: string;
    value: string;
    description: string;
    tone: "cyan" | "amber" | "rose" | "emerald";
  }>;
};

export async function getSignalingSecuritySnapshot(
  supabase: AppSupabaseClient,
): Promise<SignalingSecuritySnapshot> {
  const [alertsResult, casesResult] = await Promise.all([
    supabase
      .from("fraud_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("investigation_cases")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(12),
  ]);

  throwIfError(alertsResult.error, "Failed to fetch alerts for signaling context.");
  throwIfError(casesResult.error, "Failed to fetch cases for signaling context.");

  const incidents = buildSimulatedIncidents(
    alertsResult.data ?? [],
    casesResult.data ?? [],
  );

  return {
    summary: {
      totalIncidents: incidents.length,
      criticalIncidents: incidents.filter((item) => item.severity === "critical").length,
      activeAnomalies: incidents.filter((item) => item.status !== "contained").length,
      suspiciousLocationRequests: incidents.filter((item) =>
        item.incidentType.toLowerCase().includes("location"),
      ).length,
    },
    incidents,
    severityMix: aggregateCounts(incidents.map((item) => item.severity), 3),
    targetElements: aggregateCounts(incidents.map((item) => item.targetElement), 5),
    suspiciousNetworks: aggregateCounts(incidents.map((item) => item.sourceNetwork), 5),
    responseSignals: buildResponseSignals(incidents),
  };
}

function buildSimulatedIncidents(
  alerts: FraudAlert[],
  cases: InvestigationCase[],
): SignalingIncident[] {
  const templates = [
    {
      incidentType: "Location Tracking Abuse",
      targetElement: "HLR Gateway",
      sourceNetwork: "Unknown Interconnect",
      description:
        "Repeated location lookup requests suggest subscriber tracking abuse against the signaling plane.",
    },
    {
      incidentType: "Unauthorized Subscriber Info Request",
      targetElement: "Subscriber Data Node",
      sourceNetwork: "Rogue Roaming Partner",
      description:
        "Sensitive subscriber information requests are occurring outside the normal interconnect pattern.",
    },
    {
      incidentType: "Suspicious Roaming Update Attempt",
      targetElement: "Roaming Control Node",
      sourceNetwork: "International Signaling Hub",
      description:
        "Unexpected roaming updates indicate possible manipulation of location and service registration flows.",
    },
    {
      incidentType: "Network Element Probing",
      targetElement: "Signaling Transfer Point",
      sourceNetwork: "External Probe Cluster",
      description:
        "Sequential protocol requests indicate reconnaissance against critical telecom signaling infrastructure.",
    },
    {
      incidentType: "Subscriber Intercept Pattern",
      targetElement: "MSC Signaling Layer",
      sourceNetwork: "Untrusted Signaling Edge",
      description:
        "Call-session signaling characteristics suggest attempted interception or redirection activity.",
    },
  ] as const;

  const incidents: SignalingIncident[] = templates.map((template, index) => {
    const alert = alerts[index % Math.max(alerts.length, 1)];
    const caseItem = cases[index % Math.max(cases.length, 1)];
    const severity =
      index % 4 === 0 ? "critical" : index % 2 === 0 ? "high" : "medium";
    const status =
      caseItem?.status === "resolved"
        ? "contained"
        : alert?.status === "acknowledged"
          ? "investigating"
          : "open";

    return {
      id: `signaling-${index + 1}`,
      incidentType: template.incidentType,
      severity,
      sourceNetwork: template.sourceNetwork,
      targetElement: template.targetElement,
      status,
      description: template.description,
      createdAt: alert?.created_at ?? new Date(Date.now() - index * 7_200_000).toISOString(),
      relatedAlertId: alert?.id,
      relatedCaseId: caseItem?.alert_id === alert?.id ? caseItem?.id : undefined,
    };
  });

  return incidents;
}

function aggregateCounts(values: string[], limit: number) {
  const map = new Map<string, number>();

  values.forEach((value) => {
    map.set(value, (map.get(value) ?? 0) + 1);
  });

  return [...map.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function buildResponseSignals(
  incidents: SignalingIncident[],
): SignalingSecuritySnapshot["responseSignals"] {
  const contained = incidents.filter((incident) => incident.status === "contained").length;
  const critical = incidents.filter((incident) => incident.severity === "critical").length;
  const open = incidents.filter((incident) => incident.status === "open").length;

  return [
    {
      title: "Protocol Incidents",
      value: String(incidents.length),
      description:
        "Simulated signaling-plane events visible across the telecom security surface.",
      tone: "cyan",
    },
    {
      title: "Critical Signaling Risk",
      value: String(critical),
      description:
        "High-priority SS7-style anomalies that deserve analyst and operator attention.",
      tone: critical > 0 ? "rose" : "cyan",
    },
    {
      title: "Contained Events",
      value: String(contained),
      description:
        "Incidents with enough investigation context to mark as contained in the simulation layer.",
      tone: "emerald",
    },
    {
      title: "Open Protocol Issues",
      value: String(open),
      description:
        "Signals still awaiting review, mirroring the relationship between telecom security and fraud operations.",
      tone: open > 0 ? "amber" : "cyan",
    },
  ];
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
