import { createClient } from "@/lib/supabase/server";
import { getCasesReportRows } from "@/services/reports";

export async function GET() {
  const supabase = await createClient();
  const rows = await getCasesReportRows(supabase);

  const csv = toCsv(
    [
      "id",
      "title",
      "owner_name",
      "status",
      "priority",
      "alert_id",
      "notes_count",
      "updated_at",
    ],
    rows.map((row) => [
      row.id,
      row.title,
      row.owner_name,
      row.status,
      row.priority,
      row.alert_id,
      row.notes_count,
      row.updated_at,
    ]),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="investigation-cases-report.csv"',
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
