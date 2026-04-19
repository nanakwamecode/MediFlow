import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT NOW() as current_time`);
    return NextResponse.json({
      status: "connected",
      timestamp: result.rows[0]?.current_time,
      message: "Successfully connected to Neon PostgreSQL",
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 }
    );
  }
}
