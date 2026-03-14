"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { runFraudWorkflow } from "@/services/fraud-workflow";

export type FraudWorkflowActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function runFraudWorkflowAction(
  previousState: FraudWorkflowActionState,
): Promise<FraudWorkflowActionState> {
  try {
    void previousState;
    const supabase = await createClient();
    const result = await runFraudWorkflow(supabase);

    revalidatePath("/");

    return {
      status: "success",
      message: `Scanned ${result.scannedCalls} suspicious calls, created ${result.alertsCreated} alerts, blocked ${result.numbersBlocked} numbers.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unexpected fraud workflow error.",
    };
  }
}
