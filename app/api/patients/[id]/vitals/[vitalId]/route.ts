import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vitals } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string, vitalId: string }> }) {
  try {
    const { id: patientId, vitalId } = await params;
    await db.delete(vitals).where(and(
      eq(vitals.id, parseInt(vitalId)),
      eq(vitals.patientId, patientId)
    ));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete vital" }, { status: 500 });
  }
}
