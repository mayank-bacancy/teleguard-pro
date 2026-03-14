import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { runFraudWorkflow } from "@/services/fraud-workflow";
import type { Database, Json } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type CdrInsert = Database["public"]["Tables"]["call_detail_records"]["Insert"];
type CdrRow = Database["public"]["Tables"]["call_detail_records"]["Row"];

const cdrPayloadSchema = z.object({
  caller_number: z.string().min(3),
  receiver_number: z.string().min(3),
  call_start: z.string(),
  call_end: z.string().nullable().optional(),
  duration_seconds: z.coerce.number().int().min(0).optional(),
  call_type: z.string().default("voice"),
  source_country: z.string().min(2),
  destination_country: z.string().min(2),
  source_network: z.string().optional().nullable(),
  destination_network: z.string().optional().nullable(),
  cost: z.coerce.number().min(0).optional(),
  status: z.string().default("completed"),
  risk_score: z.coerce.number().min(0).max(100).optional(),
  is_suspicious: z.coerce.boolean().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type IngestionSummary = {
  insertedRows: number;
  rejectedRows: number;
  alertsCreated: number;
  numbersBlocked: number;
  sourceType: string;
};

export type IngestionPageData = {
  counts: {
    totalCalls: number;
    suspiciousCalls: number;
    alerts: number;
  };
  recentRows: Array<{
    id: string;
    callerNumber: string;
    receiverNumber: string;
    sourceCountry: string;
    destinationCountry: string;
    createdAt: string;
    sourceType: string;
    riskScore: number;
  }>;
};

export async function getIngestionPageData(
  supabase: AppSupabaseClient,
): Promise<IngestionPageData> {
  const [totalCallsResult, suspiciousCallsResult, alertsResult, recentRowsResult] =
    await Promise.all([
      supabase
        .from("call_detail_records")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("call_detail_records")
        .select("*", { count: "exact", head: true })
        .or("is_suspicious.eq.true,risk_score.gte.80"),
      supabase.from("fraud_alerts").select("*", { count: "exact", head: true }),
      supabase
        .from("call_detail_records")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  throwIfError(totalCallsResult.error, "Failed to count ingested CDRs.");
  throwIfError(
    suspiciousCallsResult.error,
    "Failed to count suspicious ingested CDRs.",
  );
  throwIfError(alertsResult.error, "Failed to count alerts.");
  throwIfError(recentRowsResult.error, "Failed to fetch recent ingested rows.");

  return {
    counts: {
      totalCalls: totalCallsResult.count ?? 0,
      suspiciousCalls: suspiciousCallsResult.count ?? 0,
      alerts: alertsResult.count ?? 0,
    },
    recentRows: (recentRowsResult.data ?? []).map((row) => ({
      id: row.id,
      callerNumber: row.caller_number,
      receiverNumber: row.receiver_number,
      sourceCountry: row.source_country,
      destinationCountry: row.destination_country,
      createdAt: row.created_at,
      sourceType: readIngestionSource(row),
      riskScore: Number(row.risk_score),
    })),
  };
}

export async function ingestCdrBatch(
  supabase: AppSupabaseClient,
  inputRows: unknown[],
  options?: {
    sourceType?: string;
    triggerWorkflow?: boolean;
  },
): Promise<IngestionSummary> {
  const sourceType = options?.sourceType ?? "api";
  const triggerWorkflow = options?.triggerWorkflow ?? true;

  const validRows: CdrInsert[] = [];
  let rejectedRows = 0;

  inputRows.forEach((row) => {
    const parsed = cdrPayloadSchema.safeParse(row);

    if (!parsed.success) {
      rejectedRows += 1;
      return;
    }

    try {
      validRows.push(normalizeCdr(parsed.data, sourceType));
    } catch {
      rejectedRows += 1;
    }
  });

  if (validRows.length === 0) {
    return {
      insertedRows: 0,
      rejectedRows,
      alertsCreated: 0,
      numbersBlocked: 0,
      sourceType,
    };
  }

  const insertResult = await supabase
    .from("call_detail_records")
    .insert(validRows)
    .select("id");

  throwIfError(insertResult.error, "Failed to insert ingested CDR rows.");

  let alertsCreated = 0;
  let numbersBlocked = 0;

  if (triggerWorkflow) {
    const workflow = await runFraudWorkflow(supabase);
    alertsCreated = workflow.alertsCreated;
    numbersBlocked = workflow.numbersBlocked;
  }

  return {
    insertedRows: insertResult.data?.length ?? validRows.length,
    rejectedRows,
    alertsCreated,
    numbersBlocked,
    sourceType,
  };
}

export async function ingestCsvText(
  supabase: AppSupabaseClient,
  csvText: string,
  options?: {
    triggerWorkflow?: boolean;
  },
) {
  const rows = parseCsv(csvText);
  return ingestCdrBatch(supabase, rows, {
    sourceType: "csv_upload",
    triggerWorkflow: options?.triggerWorkflow,
  });
}

function normalizeCdr(
  row: z.infer<typeof cdrPayloadSchema>,
  sourceType: string,
): CdrInsert {
  const callStart = new Date(row.call_start);

  if (Number.isNaN(callStart.getTime())) {
    throw new Error("Invalid call_start");
  }

  const durationSeconds = row.duration_seconds ?? 0;
  const callEnd =
    row.call_end && !Number.isNaN(new Date(row.call_end).getTime())
      ? new Date(row.call_end).toISOString()
      : durationSeconds > 0
        ? new Date(callStart.getTime() + durationSeconds * 1000).toISOString()
        : null;

  return {
    caller_number: row.caller_number,
    receiver_number: row.receiver_number,
    call_start: callStart.toISOString(),
    call_end: callEnd,
    duration_seconds: durationSeconds,
    call_type: row.call_type,
    source_country: row.source_country,
    destination_country: row.destination_country,
    source_network: row.source_network ?? null,
    destination_network: row.destination_network ?? null,
    cost: row.cost ?? 0,
    status: row.status,
    risk_score: row.risk_score ?? 0,
    is_suspicious: row.is_suspicious ?? false,
    metadata: {
      ...(row.metadata ?? {}),
      ingestion_source: sourceType,
      tag: "ingested",
    },
  };
}

function parseCsv(csvText: string) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]).map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

function splitCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function readIngestionSource(row: CdrRow) {
  const metadata = row.metadata;

  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "unknown";
  }

  const value = (metadata as Record<string, Json>).ingestion_source;
  return typeof value === "string" ? value : "unknown";
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
