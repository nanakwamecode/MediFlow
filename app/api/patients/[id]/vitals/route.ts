import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vitals } from "@/lib/schema";
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
    .from(vitals)
    .where(eq(vitals.patientId, id))
    .orderBy(desc(vitals.time));

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

  const [created] = await db
    .insert(vitals)
    .values({
      patientId: id,
      time: body.time ? new Date(body.time as string) : new Date(),
      sys: typeof body.sys === "number" ? body.sys : null,
      dia: typeof body.dia === "number" ? body.dia : null,
      pulse: typeof body.pulse === "number" ? body.pulse : null,
      temperature: typeof body.temperature === "number" ? body.temperature : null,
      respiratoryRate: typeof body.respiratoryRate === "number" ? body.respiratoryRate : null,
      weight: typeof body.weight === "number" ? body.weight : null,
      notes: typeof body.notes === "string" ? body.notes.trim() || null : null,
    })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
}
