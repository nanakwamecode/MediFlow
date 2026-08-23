import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labInvestigations, patients } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: labInvestigations.id,
      patientId: labInvestigations.patientId,
      timeRequested: labInvestigations.timeRequested,
      timeCompleted: labInvestigations.timeCompleted,
      requestedBy: labInvestigations.requestedBy,
      testName: labInvestigations.testName,
      status: labInvestigations.status,
      result: labInvestigations.result,
      notes: labInvestigations.notes,
      ptName: patients.name,
      ptOpd: patients.opdNumber,
    })
    .from(labInvestigations)
    .innerJoin(patients, eq(labInvestigations.patientId, patients.id))
    .orderBy(desc(labInvestigations.timeRequested));

  return NextResponse.json({ data: rows });
}
