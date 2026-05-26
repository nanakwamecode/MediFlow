import { db, isDbConfigured } from "@/lib/db";
import { users } from "@/lib/schema";
import { createSession } from "@/lib/auth";
import {
  readJsonBody,
  validateLoginBody,
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

    const validated = validateLoginBody(parsed.data);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const { username, password } = validated;

    let user;
    let valid = false;

    if (!isDbConfigured) {
      user = {
        id: "demo-admin-id",
        username: username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1) + " (Demo)",
      };
      valid = true;
    } else {
      const [dbUser] = await db
        .select({
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          passwordHash: users.passwordHash,
        })
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (dbUser) {
        user = dbUser;
        valid = await bcrypt.compare(password, dbUser.passwordHash);
      }
    }

    if (!user || !valid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    await createSession({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
