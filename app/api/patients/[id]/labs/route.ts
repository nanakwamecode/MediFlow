import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labInvestigations } from "@/lib/schema";
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
    .from(labInvestigations)
    .where(eq(labInvestigations.patientId, id))
    .orderBy(desc(labInvestigations.timeRequested));

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

  const testName =
    typeof body.testName === "string" ? body.testName.trim() : "";
  const requestedBy =
    typeof body.requestedBy === "string" ? body.requestedBy.trim() : "";

  if (!testName) {
    return NextResponse.json(
      { error: "Test name is required" },
      { status: 400 }
    );
  }
  if (!requestedBy) {
    return NextResponse.json(
      { error: "Requested by is required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(labInvestigations)
    .values({
      patientId: id,
      testName,
      requestedBy,
      notes:
        typeof body.notes === "string" ? body.notes.trim() || null : null,
    })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
}
