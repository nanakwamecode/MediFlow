import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import {
  readJsonBody,
  validateSendOtpBody,
} from "@/lib/auth-api-helpers";
import { createOtp, isRateLimited, sendSms } from "@/lib/otp";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const validated = validateSendOtpBody(parsed.data);
    if (!validated.ok) {
      return NextResponse.json(
        { error: validated.error },
        { status: 400 }
      );
    }

    const { phone, type } = validated;

    // For "reset" type, verify the phone belongs to an existing user
    if (type === "reset") {
      const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);

      if (!existing) {
        return NextResponse.json(
          { error: "No account found with this phone number." },
          { status: 404 }
        );
      }
    }

    // Rate limit check
    const limited = await isRateLimited(phone);
    if (limited) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const code = await createOtp(phone, type);

    // Send SMS (simulated in dev)
    await sendSms(
      phone,
      `Your MediFlow verification code is: ${code}. Valid for 5 minutes.`
    );

    // In development, also return the code for testing
    const isDev = process.env.NODE_ENV !== "production";

    return NextResponse.json({
      message: "OTP sent successfully.",
      ...(isDev ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
