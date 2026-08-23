import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vitals } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string; vitalId: string }>;
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, vitalId } = await params;
  const vitalIdNum = parseInt(vitalId, 10);
  if (isNaN(vitalIdNum)) {
    return NextResponse.json({ error: "Invalid vital ID" }, { status: 400 });
  }

  const [deleted] = await db
    .delete(vitals)
    .where(and(eq(vitals.id, vitalIdNum), eq(vitals.patientId, id)))
    .returning({ id: vitals.id });

  if (!deleted) {
    return NextResponse.json(
      { error: "Vital record not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: { id: deleted.id } });
}
