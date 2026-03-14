import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { ingestCdrBatch } from "@/services/ingestion";

const requestSchema = z.object({
  rows: z.array(z.unknown()).min(1),
  triggerWorkflow: z.boolean().optional(),
  sourceType: z.string().min(2).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid ingestion payload.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const result = await ingestCdrBatch(supabase, parsed.data.rows, {
      sourceType: parsed.data.sourceType ?? "api_ingestion",
      triggerWorkflow: parsed.data.triggerWorkflow ?? true,
    });

    return NextResponse.json({
      status: "ok",
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unexpected ingestion route error.",
      },
      { status: 500 },
    );
  }
}
