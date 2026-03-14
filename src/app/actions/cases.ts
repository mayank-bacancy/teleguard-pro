"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import {
  addCaseNote,
  createCaseFromAlert,
  updateCaseStatus,
} from "@/services/cases";

export type CaseActionState = {
  status: "idle" | "success" | "error";
  message: string;
  redirectTo?: string;
};

const createCaseSchema = z.object({
  alertId: z.string().uuid(),
});

const caseStatusSchema = z.object({
  caseId: z.string().uuid(),
  status: z.enum(["open", "in_review", "resolved"]),
});

const caseNoteSchema = z.object({
  caseId: z.string().uuid(),
  authorName: z.string().min(2).max(80),
  note: z.string().min(4).max(5000),
});

export async function createCaseFromAlertAction(
  previousState: CaseActionState,
  formData: FormData,
): Promise<CaseActionState> {
  try {
    void previousState;

    const parsed = createCaseSchema.safeParse({
      alertId: formData.get("alertId"),
    });

    if (!parsed.success) {
      return { status: "error", message: "Invalid alert payload." };
    }

    const supabase = await createClient();
    const caseItem = await createCaseFromAlert(supabase, parsed.data.alertId);

    if (!caseItem) {
      return {
        status: "error",
        message: "Case could not be created.",
      };
    }

    revalidatePath("/alerts");
    revalidatePath(`/alerts/${parsed.data.alertId}`);
    revalidatePath("/cases");
    revalidatePath(`/cases/${caseItem.id}`);

    return {
      status: "success",
      message: "Investigation case is ready.",
      redirectTo: `/cases/${caseItem.id}`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unexpected case creation error.",
    };
  }
}

export async function updateCaseStatusAction(
  previousState: CaseActionState,
  formData: FormData,
): Promise<CaseActionState> {
  try {
    void previousState;

    const parsed = caseStatusSchema.safeParse({
      caseId: formData.get("caseId"),
      status: formData.get("status"),
    });

    if (!parsed.success) {
      return { status: "error", message: "Invalid case status payload." };
    }

    const supabase = await createClient();
    await updateCaseStatus(supabase, parsed.data.caseId, parsed.data.status);

    revalidatePath("/cases");
    revalidatePath(`/cases/${parsed.data.caseId}`);

    return {
      status: "success",
      message: `Case marked as ${parsed.data.status}.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unexpected case status update error.",
    };
  }
}

export async function addCaseNoteAction(
  previousState: CaseActionState,
  formData: FormData,
): Promise<CaseActionState> {
  try {
    void previousState;

    const parsed = caseNoteSchema.safeParse({
      caseId: formData.get("caseId"),
      authorName: formData.get("authorName"),
      note: formData.get("note"),
    });

    if (!parsed.success) {
      return { status: "error", message: "Invalid case note payload." };
    }

    const supabase = await createClient();
    await addCaseNote(
      supabase,
      parsed.data.caseId,
      parsed.data.note,
      parsed.data.authorName,
    );

    revalidatePath("/cases");
    revalidatePath(`/cases/${parsed.data.caseId}`);

    return {
      status: "success",
      message: "Case note added.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unexpected case note error.",
    };
  }
}
