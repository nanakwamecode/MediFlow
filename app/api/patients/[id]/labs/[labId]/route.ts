import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labInvestigations } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string, labId: string }> }) {
  try {
    const { id: patientId, labId } = await params;
    const body = await req.json();

    const [updatedLab] = await db.update(labInvestigations).set({
      result: body.result,
      status: "completed",
      timeCompleted: new Date(),
    })
    .where(and(
      eq(labInvestigations.id, parseInt(labId)),
      eq(labInvestigations.patientId, patientId)
    ))
    .returning();

    return NextResponse.json({ data: updatedLab });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update lab result" }, { status: 500 });
  }
}
