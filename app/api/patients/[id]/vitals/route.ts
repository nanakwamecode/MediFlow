import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vitals } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: patientId } = await params;
    const patientVitals = await db.query.vitals.findMany({
      where: eq(vitals.patientId, patientId),
      orderBy: [desc(vitals.id)],
    });

    return NextResponse.json({ data: patientVitals });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch vitals" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: patientId } = await params;
    const body = await req.json();

    const [newVital] = await db.insert(vitals).values({
      patientId,
      sys: body.sys || null,
      dia: body.dia || null,
      pulse: body.pulse || null,
      temperature: body.temperature || null,
      respiratoryRate: body.respiratoryRate || null,
      weight: body.weight || null,
      height: body.height || null,
      bmi: body.bmi || null,
      time: body.time ? new Date(body.time) : new Date(),
      notes: body.notes || null,
    }).returning();

    return NextResponse.json({ data: newVital }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create vitals:", error);
    return NextResponse.json({ error: "Failed to create vitals" }, { status: 500 });
  }
}
