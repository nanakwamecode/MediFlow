import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labInvestigations } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allLabs = await db.query.labInvestigations.findMany({
      orderBy: [desc(labInvestigations.timeRequested)],
      limit: 100
    });

    return NextResponse.json({ data: allLabs });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch labs" }, { status: 500 });
  }
}
