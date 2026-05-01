import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const patient = await db.query.patients.findFirst({
      where: eq(patients.id, id),
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ data: patient });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const [updatedPatient] = await db.update(patients).set({
      name: body.name,
      opdNumber: body.opdNumber || null,
      age: body.age || null,
      phone: body.phone || null,
      town: body.town || null,
      gender: body.gender || null,
      dob: body.dob || null,
      notes: body.notes || null,
    })
    .where(eq(patients.id, id))
    .returning();

    return NextResponse.json({ data: updatedPatient });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(patients).where(eq(patients.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
