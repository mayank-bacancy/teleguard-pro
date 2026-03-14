import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;
type FraudRule = Database["public"]["Tables"]["fraud_rules"]["Row"];
type FraudAlert = Database["public"]["Tables"]["fraud_alerts"]["Row"];

export type BlockedNumberListItem = {
  id: string;
  phoneNumber: string;
  reason: string;
  blockedAt: string;
  isActive: boolean;
  sourceAlertTitle: string | null;
  ruleName: string | null;
};

export type RuleListItem = {
  id: string;
  name: string;
  ruleType: string;
  severity: string;
  thresholdValue: number | null;
  isActive: boolean;
  createdAt: string;
  description: string | null;
};

export type BlockedNumbersPageData = {
  counts: {
    total: number;
    active: number;
    inactive: number;
  };
  blockedNumbers: BlockedNumberListItem[];
};

export type RulesPageData = {
  counts: {
    total: number;
    active: number;
    inactive: number;
    critical: number;
  };
  rules: RuleListItem[];
};

export async function getBlockedNumbersPageData(
  supabase: AppSupabaseClient,
): Promise<BlockedNumbersPageData> {
  const [blockedResult, totalResult, activeResult, inactiveResult] =
    await Promise.all([
      supabase
        .from("blocked_numbers")
        .select("*")
        .order("blocked_at", { ascending: false }),
      supabase
        .from("blocked_numbers")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("blocked_numbers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("blocked_numbers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", false),
    ]);

  throwIfError(blockedResult.error, "Failed to fetch blocked numbers.");
  throwIfError(totalResult.error, "Failed to count blocked numbers.");
  throwIfError(activeResult.error, "Failed to count active blocked numbers.");
  throwIfError(inactiveResult.error, "Failed to count inactive blocked numbers.");

  const blockedNumbers = blockedResult.data ?? [];
  const sourceAlertIds = blockedNumbers
    .map((item) => item.source_alert_id)
    .filter((value): value is string => Boolean(value));
  const ruleIds = blockedNumbers
    .map((item) => item.blocked_by_rule_id)
    .filter((value): value is string => Boolean(value));

  const [alertsResult, rulesResult] = await Promise.all([
    sourceAlertIds.length === 0
      ? Promise.resolve({ data: [] as FraudAlert[], error: null })
      : supabase.from("fraud_alerts").select("*").in("id", sourceAlertIds),
    ruleIds.length === 0
      ? Promise.resolve({ data: [] as FraudRule[], error: null })
      : supabase.from("fraud_rules").select("*").in("id", ruleIds),
  ]);

  throwIfError(alertsResult.error, "Failed to load source alerts for blocks.");
  throwIfError(rulesResult.error, "Failed to load block rule context.");

  const alertMap = new Map((alertsResult.data ?? []).map((item) => [item.id, item]));
  const ruleMap = new Map((rulesResult.data ?? []).map((item) => [item.id, item]));

  return {
    counts: {
      total: totalResult.count ?? 0,
      active: activeResult.count ?? 0,
      inactive: inactiveResult.count ?? 0,
    },
    blockedNumbers: blockedNumbers.map((item) => ({
      id: item.id,
      phoneNumber: item.phone_number,
      reason: item.reason,
      blockedAt: item.blocked_at,
      isActive: item.is_active,
      sourceAlertTitle: item.source_alert_id
        ? alertMap.get(item.source_alert_id)?.title ?? null
        : null,
      ruleName: item.blocked_by_rule_id
        ? ruleMap.get(item.blocked_by_rule_id)?.name ?? null
        : null,
    })),
  };
}

export async function getRulesPageData(
  supabase: AppSupabaseClient,
): Promise<RulesPageData> {
  const [rulesResult, totalResult, activeResult, inactiveResult, criticalResult] =
    await Promise.all([
      supabase.from("fraud_rules").select("*").order("created_at", {
        ascending: false,
      }),
      supabase.from("fraud_rules").select("*", { count: "exact", head: true }),
      supabase
        .from("fraud_rules")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("fraud_rules")
        .select("*", { count: "exact", head: true })
        .eq("is_active", false),
      supabase
        .from("fraud_rules")
        .select("*", { count: "exact", head: true })
        .eq("severity", "critical"),
    ]);

  throwIfError(rulesResult.error, "Failed to fetch fraud rules.");
  throwIfError(totalResult.error, "Failed to count fraud rules.");
  throwIfError(activeResult.error, "Failed to count active fraud rules.");
  throwIfError(inactiveResult.error, "Failed to count inactive fraud rules.");
  throwIfError(criticalResult.error, "Failed to count critical fraud rules.");

  return {
    counts: {
      total: totalResult.count ?? 0,
      active: activeResult.count ?? 0,
      inactive: inactiveResult.count ?? 0,
      critical: criticalResult.count ?? 0,
    },
    rules: (rulesResult.data ?? []).map((rule) => ({
      id: rule.id,
      name: rule.name,
      ruleType: rule.rule_type,
      severity: rule.severity,
      thresholdValue: rule.threshold_value,
      isActive: rule.is_active,
      createdAt: rule.created_at,
      description: rule.description,
    })),
  };
}

export async function deactivateBlockedNumber(
  supabase: AppSupabaseClient,
  blockedNumberId: string,
) {
  const result = await supabase
    .from("blocked_numbers")
    .update({
      is_active: false,
      unblocked_at: new Date().toISOString(),
    })
    .eq("id", blockedNumberId)
    .select("id")
    .single();

  throwIfError(result.error, "Failed to unblock number.");
}

export async function setFraudRuleState(
  supabase: AppSupabaseClient,
  ruleId: string,
  isActive: boolean,
) {
  const result = await supabase
    .from("fraud_rules")
    .update({ is_active: isActive })
    .eq("id", ruleId)
    .select("id")
    .single();

  throwIfError(result.error, "Failed to update fraud rule state.");
}

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) {
    throw new Error(`${fallbackMessage} ${error.message}`);
  }
}
