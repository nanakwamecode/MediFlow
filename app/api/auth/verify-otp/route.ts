import {
  readJsonBody,
  validateSendOtpBody,
} from "@/lib/auth-api-helpers";
import { verifyOtp } from "@/lib/otp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    // Reuse sendOtp validation — we need phone + type
    const data = parsed.data as Record<string, unknown>;
    const phone =
      typeof data.phone === "string" ? data.phone.trim() : "";
    const code =
      typeof data.code === "string" ? data.code.trim() : "";
    const type = typeof data.type === "string" ? data.type.trim() : "";

    if (!phone || !code || code.length !== 6) {
      return NextResponse.json(
        { error: "Phone and a 6-digit code are required." },
        { status: 400 }
      );
    }
    if (type !== "register" && type !== "reset") {
      return NextResponse.json(
        { error: "Type must be 'register' or 'reset'." },
        { status: 400 }
      );
    }

    const valid = await verifyOtp(phone, code, type);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP code." },
        { status: 401 }
      );
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
