import { db, isDbConfigured } from "@/lib/db";
import { users } from "@/lib/schema";
import {
  createSession,
  deleteSession,
  getSession,
} from "@/lib/auth";
import {
  readJsonBody,
  validatePatchMeBody,
} from "@/lib/auth-api-helpers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  let row;
  if (!isDbConfigured) {
    row = {
      id: session.userId,
      username: session.username,
      displayName: session.displayName,
    };
  } else {
    const [dbRow] = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    row = dbRow;
  }

  if (!row) {
    await deleteSession();
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: row.id,
      username: row.username,
      displayName: row.displayName,
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const parsed = await readJsonBody(req);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const validated = validatePatchMeBody(parsed.data);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    let row;
    if (!isDbConfigured) {
      row = {
        id: session.userId,
        username: session.username,
        displayName: validated.displayName,
      };
    } else {
      const [dbRow] = await db
        .update(users)
        .set({ displayName: validated.displayName })
        .where(eq(users.id, session.userId))
        .returning({
          id: users.id,
          username: users.username,
          displayName: users.displayName,
        });
      row = dbRow;
    }

    if (!row) {
      await deleteSession();
      return NextResponse.json({ error: "Account not found." }, { status: 401 });
    }

    await createSession({
      userId: row.id,
      username: row.username,
      displayName: row.displayName,
    });

    return NextResponse.json({
      user: {
        id: row.id,
        username: row.username,
        displayName: row.displayName,
      },
    });
  } catch (error) {
    console.error("PATCH /api/auth/me error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
