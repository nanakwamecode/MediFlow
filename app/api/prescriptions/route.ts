import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prescriptions, patients } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: prescriptions.id,
      patientId: prescriptions.patientId,
      timePrescribed: prescriptions.timePrescribed,
      timeDispensed: prescriptions.timeDispensed,
      prescribedBy: prescriptions.prescribedBy,
      medication: prescriptions.medication,
      dosage: prescriptions.dosage,
      instructions: prescriptions.instructions,
      status: prescriptions.status,
      ptName: patients.name,
      ptOpd: patients.opdNumber,
    })
    .from(prescriptions)
    .innerJoin(patients, eq(prescriptions.patientId, patients.id))
    .orderBy(desc(prescriptions.timePrescribed));

  return NextResponse.json({ data: rows });
}
