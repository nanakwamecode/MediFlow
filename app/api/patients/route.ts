import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { desc, ilike, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.get("search")?.trim();

  const rows = search
    ? await db
        .select()
        .from(patients)
        .where(
          or(
            ilike(patients.name, `%${search}%`),
            ilike(patients.opdNumber, `%${search}%`),
            ilike(patients.phone, `%${search}%`),
            ilike(patients.town, `%${search}%`)
          )
        )
        .orderBy(desc(patients.createdAt))
    : await db
        .select()
        .from(patients)
        .orderBy(desc(patients.createdAt));

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json(
      { error: "Patient name is required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(patients)
    .values({
      name,
      opdNumber: typeof body.opdNumber === "string" ? body.opdNumber.trim() || null : null,
      age: typeof body.age === "string" ? body.age.trim() || null : null,
      phone: typeof body.phone === "string" ? body.phone.trim() || null : null,
      town: typeof body.town === "string" ? body.town.trim() || null : null,
      gender: typeof body.gender === "string" ? body.gender.trim() || null : null,
      dob: typeof body.dob === "string" ? body.dob.trim() || null : null,
      notes: typeof body.notes === "string" ? body.notes.trim() || null : null,
    })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
}
