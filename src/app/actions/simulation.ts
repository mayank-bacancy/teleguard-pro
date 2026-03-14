"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { runSimulationBatch } from "@/services/simulation";

export type SimulationActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const simulationSchema = z.object({
  batchSize: z.coerce.number().int().min(3).max(12),
});

export async function runSimulationAction(
  previousState: SimulationActionState,
  formData: FormData,
): Promise<SimulationActionState> {
  try {
    void previousState;

    const parsed = simulationSchema.safeParse({
      batchSize: formData.get("batchSize"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: "Invalid simulation batch size.",
      };
    }

    const supabase = await createClient();
    const result = await runSimulationBatch(supabase, parsed.data.batchSize);

    revalidatePath("/");
    revalidatePath("/alerts");
    revalidatePath("/blocked-numbers");
    revalidatePath("/rules");
    revalidatePath("/analytics");

    return {
      status: "success",
      message: `Inserted ${result.insertedCalls} CDRs, flagged ${result.suspiciousInserted} suspicious events, created ${result.alertsCreated} alerts, and changed ${result.numbersBlocked} blocks.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unexpected realtime simulation error.",
    };
  }
}
