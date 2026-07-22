import { getRecentAssignments } from "../../../lib/assignment";

export const dynamic = "force-dynamic";

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  const rows = await getRecentAssignments(1000);

  const csv = [
    ["numero_asignacion", "asesor_id", "asesor", "fecha_iso", "fecha_chile"]
      .map(csvCell)
      .join(","),
    ...rows.map((row) =>
      [
        row.scanNumber,
        row.advisorId,
        row.advisorName,
        row.timestamp,
        new Date(row.timestamp).toLocaleString("es-CL", {
          timeZone: "America/Santiago",
        }),
      ]
        .map(csvCell)
        .join(",")
    ),
  ].join("\n");

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="contactos-qr.csv"',
      "Cache-Control": "no-store",
    },
  });
}
