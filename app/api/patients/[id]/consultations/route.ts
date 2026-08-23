import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultations } from "@/lib/schema";
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
    .from(consultations)
    .where(eq(consultations.patientId, id))
    .orderBy(desc(consultations.time));

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

  const doctorId =
    typeof body.doctorId === "string" ? body.doctorId.trim() : "";
  if (!doctorId) {
    return NextResponse.json(
      { error: "Doctor ID is required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(consultations)
    .values({
      patientId: id,
      time: body.time ? new Date(body.time as string) : new Date(),
      doctorId,
      symptoms:
        typeof body.symptoms === "string"
          ? body.symptoms.trim() || null
          : null,
      diagnosis:
        typeof body.diagnosis === "string"
          ? body.diagnosis.trim() || null
          : null,
      notes:
        typeof body.notes === "string" ? body.notes.trim() || null : null,
    })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
}
