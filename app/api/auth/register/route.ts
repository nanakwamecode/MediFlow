import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { createSession } from "@/lib/auth";
import {
  isUniqueViolation,
  readJsonBody,
  validateRegisterBody,
} from "@/lib/auth-api-helpers";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const validated = validateRegisterBody(parsed.data);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const { username, password, displayName } = validated;

    // Check if username already taken
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Username already taken." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let newUser;
    try {
      [newUser] = await db
        .insert(users)
        .values({
          username,
          passwordHash,
          displayName,
        })
        .returning({
          id: users.id,
          username: users.username,
          displayName: users.displayName,
        });
    } catch (e) {
      if (isUniqueViolation(e)) {
        return NextResponse.json(
          { error: "Username already taken." },
          { status: 409 }
        );
      }
      throw e;
    }

    await createSession({
      userId: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
    });

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          username: newUser.username,
          displayName: newUser.displayName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
