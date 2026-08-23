import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labInvestigations } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string; labId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, labId } = await params;
  const labIdNum = parseInt(labId, 10);
  if (isNaN(labIdNum)) {
    return NextResponse.json({ error: "Invalid lab ID" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = typeof body.result === "string" ? body.result.trim() : null;
  const status = body.status === "completed" || body.status === "cancelled"
    ? body.status
    : undefined;

  const updates: Record<string, unknown> = {};
  if (result !== null) updates.result = result;
  if (status) {
    updates.status = status;
    if (status === "completed") {
      updates.timeCompleted = new Date();
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(labInvestigations)
    .set(updates)
    .where(
      and(
        eq(labInvestigations.id, labIdNum),
        eq(labInvestigations.patientId, id)
      )
    )
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "Lab investigation not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: updated });
}
