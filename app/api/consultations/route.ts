import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultations, patients } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: consultations.id,
      patientId: consultations.patientId,
      time: consultations.time,
      doctorId: consultations.doctorId,
      symptoms: consultations.symptoms,
      diagnosis: consultations.diagnosis,
      notes: consultations.notes,
      ptName: patients.name,
      ptOpd: patients.opdNumber,
    })
    .from(consultations)
    .innerJoin(patients, eq(consultations.patientId, patients.id))
    .orderBy(desc(consultations.time));

  return NextResponse.json({ data: rows });
}
