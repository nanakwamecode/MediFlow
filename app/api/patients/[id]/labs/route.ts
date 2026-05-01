import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labInvestigations } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: patientId } = await params;
    const patientLabs = await db.query.labInvestigations.findMany({
      where: eq(labInvestigations.patientId, patientId),
      orderBy: [desc(labInvestigations.timeRequested)],
    });

    return NextResponse.json({ data: patientLabs });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch labs" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: patientId } = await params;
    const body = await req.json();

    const [newLab] = await db.insert(labInvestigations).values({
      patientId,
      requestedBy: body.requestedBy,
      testName: body.testName,
      status: "pending",
      notes: body.notes || null,
    }).returning();

    return NextResponse.json({ data: newLab }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to request lab" }, { status: 500 });
  }
}
