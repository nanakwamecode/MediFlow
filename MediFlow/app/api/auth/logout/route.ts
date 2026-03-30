import { deleteSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Could not sign out. Please try again." },
      { status: 500 }
    );
  }
}
