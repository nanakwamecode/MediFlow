import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import {
  readJsonBody,
  validateResetPasswordBody,
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

    const validated = validateResetPasswordBody(parsed.data);
    if (!validated.ok) {
      return NextResponse.json(
        { error: validated.error },
        { status: 400 }
      );
    }

    const { phone, code, newPassword } = validated;

    // Verify OTP
    const valid = await verifyOtp(phone, code, "reset");
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP code." },
        { status: 401 }
      );
    }

    // Find user by phone
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this phone number." },
        { status: 404 }
      );
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      message: "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
