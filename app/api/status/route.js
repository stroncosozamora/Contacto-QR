import { NextResponse } from "next/server";
import { getDistributionSnapshot } from "../../../lib/assignment";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getDistributionSnapshot({ recentLimit: 0 });

  return NextResponse.json(
    {
      total: snapshot.total,
      mode: snapshot.mode,
      nextAdvisor: {
        id: snapshot.nextAdvisor.id,
        name: snapshot.nextAdvisor.name,
      },
      advisors: snapshot.assignments.map((advisor) => ({
        id: advisor.id,
        name: advisor.name,
        phone: advisor.phone,
        assigned: advisor.assigned,
        percentage: Number(advisor.percentage.toFixed(2)),
      })),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
