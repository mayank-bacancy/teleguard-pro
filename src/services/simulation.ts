import type { SupabaseClient } from "@supabase/supabase-js";

import { runFraudWorkflow, type FraudWorkflowResult } from "@/services/fraud-workflow";
import type { Database } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type CdrInsert = Database["public"]["Tables"]["call_detail_records"]["Insert"];

const normalRoutes = [
  {
    sourceCountry: "India",
    destinationCountry: "India",
    sourceNetwork: "Airtel",
    destinationNetwork: "Jio",
  },
  {
    sourceCountry: "United States",
    destinationCountry: "United States",
    sourceNetwork: "AT&T",
    destinationNetwork: "Verizon",
  },
  {
    sourceCountry: "United Kingdom",
    destinationCountry: "France",
    sourceNetwork: "Vodafone UK",
    destinationNetwork: "Orange",
  },
];

const suspiciousRoutes = [
  {
    scenario: "burst_calls",
    sourceCountry: "United States",
    destinationCountry: "United States",
    sourceNetwork: "AT&T",
    destinationNetwork: "AT&T",
    riskBase: 84,
  },
  {
    scenario: "multi_country",
    sourceCountry: "Nigeria",
    destinationCountry: "Germany",
    sourceNetwork: "MTN",
    destinationNetwork: "Telekom",
    riskBase: 87,
  },
  {
    scenario: "high_duration",
    sourceCountry: "Bangladesh",
    destinationCountry: "United Arab Emirates",
    sourceNetwork: "Grameenphone",
    destinationNetwork: "Etisalat",
    riskBase: 92,
  },
];

export type SimulationRunResult = FraudWorkflowResult & {
  insertedCalls: number;
  suspiciousInserted: number;
};

export async function runSimulationBatch(
  supabase: AppSupabaseClient,
  batchSize = 6,
): Promise<SimulationRunResult> {
  const inserts = buildSimulationBatch(batchSize);

  const insertedResult = await supabase
    .from("call_detail_records")
    .insert(inserts)
    .select("id, is_suspicious");

  throwIfError(insertedResult.error, "Failed to insert simulated CDR batch.");

  const workflow = await runFraudWorkflow(supabase);
  const insertedCalls = insertedResult.data?.length ?? 0;
  const suspiciousInserted =
    insertedResult.data?.filter((row) => row.is_suspicious).length ?? 0;

  return {
    insertedCalls,
    suspiciousInserted,
    ...workflow,
  };
}

function buildSimulationBatch(batchSize: number): CdrInsert[] {
  const safeBatchSize = Math.min(Math.max(batchSize, 3), 12);
  const inserts: CdrInsert[] = [];

  for (let index = 0; index < safeBatchSize; index += 1) {
    const suspicious = index % 3 !== 0;
    inserts.push(
      suspicious
        ? buildSuspiciousCdr(index)
        : buildNormalCdr(index),
    );
  }

  return inserts;
}

function buildNormalCdr(index: number): CdrInsert {
  const route = normalRoutes[index % normalRoutes.length];
  const startedAt = new Date(Date.now() - (index + 1) * 60_000);
  const durationSeconds = 90 + index * 18;

  return {
    caller_number: `+1${2000000000 + 7000 + index}`,
    receiver_number: `+1${2000000000 + 9000 + index}`,
    call_start: startedAt.toISOString(),
    call_end: new Date(startedAt.getTime() + durationSeconds * 1000).toISOString(),
    duration_seconds: durationSeconds,
    call_type: "voice",
    source_country: route.sourceCountry,
    destination_country: route.destinationCountry,
    source_network: route.sourceNetwork,
    destination_network: route.destinationNetwork,
    cost: Number((0.15 + index * 0.07).toFixed(2)),
    status: "completed",
    risk_score: 12 + index * 4,
    is_suspicious: false,
    metadata: {
      scenario: "normal_stream",
      tag: "simulation",
      batch_kind: "realtime",
    },
  };
}

function buildSuspiciousCdr(index: number): CdrInsert {
  const route = suspiciousRoutes[index % suspiciousRoutes.length];
  const startedAt = new Date(Date.now() - (index + 1) * 45_000);
  const highDuration = route.scenario === "high_duration";
  const durationSeconds = highDuration ? 1800 + index * 35 : 20 + index * 7;
  const sourceNumber =
    route.scenario === "multi_country"
      ? "+2348012345678"
      : route.scenario === "high_duration"
        ? "+8801712345678"
        : "+12025550001";

  return {
    caller_number: sourceNumber,
    receiver_number: `+${400000000000 + index * 17}`,
    call_start: startedAt.toISOString(),
    call_end: new Date(startedAt.getTime() + durationSeconds * 1000).toISOString(),
    duration_seconds: durationSeconds,
    call_type: "voice",
    source_country: route.sourceCountry,
    destination_country: route.destinationCountry,
    source_network: route.sourceNetwork,
    destination_network: route.destinationNetwork,
    cost: Number((3.5 + index * 0.9).toFixed(2)),
    status: "completed",
    risk_score: route.riskBase + (index % 4),
    is_suspicious: true,
    metadata: {
      scenario: route.scenario,
      tag: "simulation",
      batch_kind: "realtime",
      burst_batch: route.scenario === "burst_calls" ? 2 : undefined,
      countries_called: route.scenario === "multi_country" ? 4 : undefined,
    },
  };
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
