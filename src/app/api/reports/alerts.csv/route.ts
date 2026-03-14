import { createClient } from "@/lib/supabase/server";
import { getAlertsReportRows } from "@/services/reports";

export async function GET() {
  const supabase = await createClient();
  const rows = await getAlertsReportRows(supabase);

  const csv = toCsv(
    ["id", "title", "severity", "status", "source_number", "risk_score", "created_at"],
    rows.map((row) => [
      row.id,
      row.title,
      row.severity,
      row.status,
      row.source_number,
      row.risk_score,
      row.created_at,
    ]),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="fraud-alerts-report.csv"',
    },
  });
}

function toCsv(headers: string[], rows: Array<Array<string | number | null>>) {
  const serialize = (value: string | number | null) => {
    const safe = value === null ? "" : String(value);
    return `"${safe.replaceAll('"', '""')}"`;
  };

  return [headers.map(serialize).join(","), ...rows.map((row) => row.map(serialize).join(","))].join("\n");
}
