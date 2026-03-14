"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { updateAlertStatus } from "@/services/alerts";

export type AlertStatusActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const alertStatusSchema = z.object({
  alertId: z.string().uuid(),
  status: z.enum(["open", "acknowledged", "resolved"]),
});

export async function updateAlertStatusAction(
  previousState: AlertStatusActionState,
  formData: FormData,
): Promise<AlertStatusActionState> {
  try {
    void previousState;

    const parsed = alertStatusSchema.safeParse({
      alertId: formData.get("alertId"),
      status: formData.get("status"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: "Invalid alert status update payload.",
      };
    }

    const supabase = await createClient();
    await updateAlertStatus(
      supabase,
      parsed.data.alertId,
      parsed.data.status,
    );

    revalidatePath("/");
    revalidatePath("/alerts");
    revalidatePath(`/alerts/${parsed.data.alertId}`);

    return {
      status: "success",
      message: `Alert marked as ${parsed.data.status}.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unexpected alert status update error.",
    };
  }
}
