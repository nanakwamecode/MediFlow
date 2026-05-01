import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vitals, patients } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allVitals = await db.select({
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
    .orderBy(desc(vitals.id));

    return NextResponse.json({ data: allVitals });
  } catch (error: any) {
    console.error("Failed to fetch all vitals:", error);
    return NextResponse.json({ error: "Failed to fetch vitals" }, { status: 500 });
  }
}
