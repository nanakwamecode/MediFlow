import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { createSession } from "@/lib/auth";
import {
  isUniqueViolation,
  readJsonBody,
  validateRegisterBody,
} from "@/lib/auth-api-helpers";
import { verifyOtp } from "@/lib/otp";
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

    const { username, password, displayName, phone, otpCode } = validated;

    // Verify the OTP code
    const otpValid = await verifyOtp(phone, otpCode, "register");
    if (!otpValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP code. Please request a new one." },
        { status: 401 }
      );
    }

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

    // Check if phone already registered
    const existingPhone = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (existingPhone.length > 0) {
      return NextResponse.json(
        { error: "This phone number is already registered." },
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
          phone,
        })
        .returning({
          id: users.id,
          username: users.username,
          displayName: users.displayName,
        });
    } catch (e) {
      if (isUniqueViolation(e)) {
        return NextResponse.json(
          { error: "Username or phone already taken." },
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
