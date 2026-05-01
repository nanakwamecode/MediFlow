import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultations } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: patientId } = params;
    const patientConsults = await db.query.consultations.findMany({
      where: eq(consultations.patientId, patientId),
      orderBy: [desc(consultations.time)],
    });

    return NextResponse.json({ data: patientConsults });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: patientId } = params;
    const body = await req.json();

    const [newConsult] = await db.insert(consultations).values({
      patientId,
      doctorId: body.doctorId,
      symptoms: body.symptoms || null,
      diagnosis: body.diagnosis || null,
      notes: body.notes || null,
      time: body.time ? new Date(body.time) : new Date(),
    }).returning();

    return NextResponse.json({ data: newConsult }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create consultation" }, { status: 500 });
  }
}
