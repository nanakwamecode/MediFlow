import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prescriptions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: { id: string, rxId: string } }) {
  try {
    const { id: patientId, rxId } = params;

    const [updatedRx] = await db.update(prescriptions).set({
      status: "dispensed",
      timeDispensed: new Date(),
    })
    .where(and(
      eq(prescriptions.id, parseInt(rxId)),
      eq(prescriptions.patientId, patientId)
    ))
    .returning();

    return NextResponse.json({ data: updatedRx });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to dispense prescription" }, { status: 500 });
  }
}
