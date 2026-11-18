import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultations } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string; consultId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, consultId } = await params;
  const consultIdNum = parseInt(consultId, 10);
  if (isNaN(consultIdNum)) {
    return NextResponse.json(
      { error: "Invalid consultation ID" },
      { status: 400 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Record<string, string | null> = {};
  for (const field of ["symptoms", "diagnosis", "notes"] as const) {
    if (field in body) {
      const val = body[field];
      updates[field] =
        typeof val === "string" && val.trim() ? val.trim() : null;
    }
  }
  if ("doctorId" in body) {
    const val = body.doctorId;
    if (typeof val === "string" && val.trim()) {
      updates.doctorId = val.trim();
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(consultations)
    .set(updates)
    .where(
      and(eq(consultations.id, consultIdNum), eq(consultations.patientId, id))
    )
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "Consultation not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: updated });
}
