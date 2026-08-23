import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prescriptions } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const rows = await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.patientId, id))
    .orderBy(desc(prescriptions.timePrescribed));

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const medication =
    typeof body.medication === "string" ? body.medication.trim() : "";
  const dosage =
    typeof body.dosage === "string" ? body.dosage.trim() : "";
  const instructions =
    typeof body.instructions === "string" ? body.instructions.trim() : "";
  const prescribedBy =
    typeof body.prescribedBy === "string" ? body.prescribedBy.trim() : "";

  if (!medication || !dosage || !instructions || !prescribedBy) {
    return NextResponse.json(
      { error: "Medication, dosage, instructions, and prescribedBy are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(prescriptions)
    .values({
      patientId: id,
      prescribedBy,
      medication,
      dosage,
      instructions,
    })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
}
