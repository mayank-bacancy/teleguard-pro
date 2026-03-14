import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { runFraudWorkflow } from "@/services/fraud-workflow";

export async function POST() {
  try {
    const supabase = await createClient();
    const result = await runFraudWorkflow(supabase);

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
            : "Unexpected fraud workflow error.",
      },
      { status: 500 },
    );
  }
}
