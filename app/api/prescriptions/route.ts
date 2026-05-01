import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prescriptions } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allPrescriptions = await db.query.prescriptions.findMany({
      orderBy: [desc(prescriptions.timePrescribed)],
      limit: 100
    });

    return NextResponse.json({ data: allPrescriptions });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}
