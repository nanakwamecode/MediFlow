import { NextResponse } from "next/server";
import { db, ensureVitalsColumns } from "@/lib/db";
import { vitals, patients } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureVitalsColumns();
  const rows = await db
    .select({
      id: vitals.id,
      patientId: vitals.patientId,
      time: vitals.time,
      sys: vitals.sys,
      dia: vitals.dia,
      pulse: vitals.pulse,
      temperature: vitals.temperature,
      respiratoryRate: vitals.respiratoryRate,
      weight: vitals.weight,
      height: vitals.height,
      bmi: vitals.bmi,
      notes: vitals.notes,
      ptName: patients.name,
      ptOpd: patients.opdNumber,
    })
    .from(vitals)
    .innerJoin(patients, eq(vitals.patientId, patients.id))
    .orderBy(desc(vitals.time));

  return NextResponse.json({ data: rows });
}
