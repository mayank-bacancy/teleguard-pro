"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import {
  deactivateBlockedNumber,
  setFraudRuleState,
} from "@/services/control-center";

export type ControlCenterActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const unblockSchema = z.object({
  blockedNumberId: z.string().uuid(),
});

const toggleRuleSchema = z.object({
  ruleId: z.string().uuid(),
  isActive: z.enum(["true", "false"]),
});

export async function unblockNumberAction(
  previousState: ControlCenterActionState,
  formData: FormData,
): Promise<ControlCenterActionState> {
  try {
    void previousState;

    const parsed = unblockSchema.safeParse({
      blockedNumberId: formData.get("blockedNumberId"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: "Invalid blocked number payload.",
      };
    }

    const supabase = await createClient();
    await deactivateBlockedNumber(supabase, parsed.data.blockedNumberId);

    revalidatePath("/");
    revalidatePath("/alerts");
    revalidatePath("/blocked-numbers");

    return {
      status: "success",
      message: "Blocked number has been released.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unexpected blocked number update error.",
    };
  }
}

export async function toggleRuleAction(
  previousState: ControlCenterActionState,
  formData: FormData,
): Promise<ControlCenterActionState> {
  try {
    void previousState;

    const parsed = toggleRuleSchema.safeParse({
      ruleId: formData.get("ruleId"),
      isActive: formData.get("isActive"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: "Invalid fraud rule payload.",
      };
    }

    const supabase = await createClient();
    await setFraudRuleState(
      supabase,
      parsed.data.ruleId,
      parsed.data.isActive === "true",
    );

    revalidatePath("/");
    revalidatePath("/alerts");
    revalidatePath("/rules");

    return {
      status: "success",
      message: `Rule ${parsed.data.isActive === "true" ? "enabled" : "disabled"}.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unexpected fraud rule update error.",
    };
  }
}
