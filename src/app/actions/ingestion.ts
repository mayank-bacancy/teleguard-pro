"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { ingestCsvText } from "@/services/ingestion";

export type IngestionActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialError = "Invalid CSV upload payload.";

export async function ingestCsvAction(
  previousState: IngestionActionState,
  formData: FormData,
): Promise<IngestionActionState> {
  try {
    void previousState;

    const file = formData.get("csvFile");

    if (!(file instanceof File) || file.size === 0) {
      return {
        status: "error",
        message: initialError,
      };
    }

    const csvText = await file.text();
    const supabase = await createClient();
    const result = await ingestCsvText(supabase, csvText, {
      triggerWorkflow: true,
    });

    revalidatePath("/");
    revalidatePath("/alerts");
    revalidatePath("/analytics");
    revalidatePath("/network-security");
    revalidatePath("/ingestion");

    return {
      status: "success",
      message: `Uploaded ${result.insertedRows} rows, rejected ${result.rejectedRows}, created ${result.alertsCreated} alerts, and changed ${result.numbersBlocked} blocks.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unexpected ingestion upload error.",
    };
  }
}
