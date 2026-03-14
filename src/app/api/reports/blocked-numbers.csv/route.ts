import { createClient } from "@/lib/supabase/server";
import { getBlockedNumbersReportRows } from "@/services/reports";

export async function GET() {
  const supabase = await createClient();
  const rows = await getBlockedNumbersReportRows(supabase);

  const csv = toCsv(
    [
      "id",
      "phone_number",
      "reason",
      "is_active",
      "source_alert_id",
      "blocked_by_rule_id",
      "blocked_at",
      "unblocked_at",
    ],
    rows.map((row) => [
      row.id,
      row.phone_number,
      row.reason,
      row.is_active,
      row.source_alert_id,
      row.blocked_by_rule_id,
      row.blocked_at,
      row.unblocked_at,
    ]),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="blocked-numbers-report.csv"',
    },
  });
}

function toCsv(headers: string[], rows: Array<Array<string | number | boolean | null>>) {
  const serialize = (value: string | number | boolean | null) => {
    const safe = value === null ? "" : String(value);
    return `"${safe.replaceAll('"', '""')}"`;
  };

  return [headers.map(serialize).join(","), ...rows.map((row) => row.map(serialize).join(","))].join("\n");
}
