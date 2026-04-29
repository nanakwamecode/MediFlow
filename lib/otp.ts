import { db } from "@/lib/db";
import { otpCodes } from "@/lib/schema";
import { eq, and, gt, desc } from "drizzle-orm";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTPS_PER_WINDOW = 3;
const RATE_LIMIT_WINDOW_MINUTES = 10;

/** Generate a random 6-digit OTP code */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Send OTP via SMS */
export async function sendSms(
  phone: string,
  message: string
): Promise<boolean> {
  const apiKey = process.env.ARKESEL_API_KEY;

  if (!apiKey) {
    console.log(`\n📱 [SMS SIMULATED → ${phone}] ${message}\n`);
    console.log("⚠️ Set ARKESEL_API_KEY in .env.local to send real SMS.");
    return true;
  }

  try {
    const res = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: "MediFlow",
        message: message,
        recipients: [phone],
      }),
    });

    if (!res.ok) {
      console.error("Arkesel API Error:", await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send SMS via Arkesel:", error);
    return false;
  }
}

/** Check rate limit: max OTPs in a time window */
export async function isRateLimited(phone: string): Promise<boolean> {
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  );

  const recent = await db
    .select({ id: otpCodes.id })
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.phone, phone),
        gt(otpCodes.createdAt, windowStart)
      )
    );

  return recent.length >= MAX_OTPS_PER_WINDOW;
}

/** Create and store a new OTP code */
export async function createOtp(
  phone: string,
  type: "register" | "reset"
): Promise<string> {
  const code = generateOtpCode();
  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await db.insert(otpCodes).values({
    phone,
    code,
    type,
    expiresAt,
  });

  return code;
}

/** Verify an OTP code — returns true if valid */
export async function verifyOtp(
  phone: string,
  code: string,
  type: "register" | "reset"
): Promise<boolean> {
  const now = new Date();

  const [row] = await db
    .select({ id: otpCodes.id, expiresAt: otpCodes.expiresAt })
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.phone, phone),
        eq(otpCodes.code, code),
        eq(otpCodes.type, type),
        eq(otpCodes.used, 0)
      )
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (!row) return false;
  if (new Date(row.expiresAt) < now) return false;

  // Mark as used
  await db
    .update(otpCodes)
    .set({ used: 1 })
    .where(eq(otpCodes.id, row.id));

  return true;
}
