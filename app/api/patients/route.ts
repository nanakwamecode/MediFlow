import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allPatients = await db.query.patients.findMany({
      orderBy: [desc(patients.createdAt)],
    });
    return NextResponse.json({ data: allPatients });
  } catch (error: any) {
    console.error("Failed to fetch patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newPatient] = await db.insert(patients).values({
      name: body.name,
      opdNumber: body.opdNumber || null,
      age: body.age || null,
      phone: body.phone || null,
      town: body.town || null,
      gender: body.gender || null,
      dob: body.dob || null,
      notes: body.notes || null,
    }).returning();

    return NextResponse.json({ data: newPatient }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create patient:", error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
