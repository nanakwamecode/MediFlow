import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultations } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allConsults = await db.query.consultations.findMany({
      orderBy: [desc(consultations.time)],
      limit: 100
    });

    return NextResponse.json({ data: allConsults });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 });
  }
}
