import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prescriptions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: patientId } = await params;
    const patientPrescriptions = await db.query.prescriptions.findMany({
      where: eq(prescriptions.patientId, patientId),
      orderBy: [desc(prescriptions.timePrescribed)],
    });

    return NextResponse.json({ data: patientPrescriptions });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: patientId } = await params;
    const body = await req.json();

    const [newPrescription] = await db.insert(prescriptions).values({
      patientId,
      prescribedBy: body.prescribedBy,
      medication: body.medication,
      dosage: body.dosage,
      instructions: body.instructions,
      status: "pending",
    }).returning();

    return NextResponse.json({ data: newPrescription }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 });
  }
}
