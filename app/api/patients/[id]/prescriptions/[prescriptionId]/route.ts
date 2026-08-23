import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prescriptions } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string; prescriptionId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, prescriptionId } = await params;
  const prescIdNum = parseInt(prescriptionId, 10);
  if (isNaN(prescIdNum)) {
    return NextResponse.json(
      { error: "Invalid prescription ID" },
      { status: 400 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const status =
    body.status === "dispensed" || body.status === "cancelled"
      ? body.status
      : undefined;

  if (!status) {
    return NextResponse.json(
      { error: "Status must be 'dispensed' or 'cancelled'" },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = { status };
  if (status === "dispensed") {
    updates.timeDispensed = new Date();
  }

  const [updated] = await db
    .update(prescriptions)
    .set(updates)
    .where(
      and(
        eq(prescriptions.id, prescIdNum),
        eq(prescriptions.patientId, id)
      )
    )
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "Prescription not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: updated });
}
