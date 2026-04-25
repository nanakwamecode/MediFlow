import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log("Running migration...");

  // 1. Create the otp_code_type enum
  try {
    await sql`CREATE TYPE "public"."otp_code_type" AS ENUM('register', 'reset')`;
    console.log("✓ Created otp_code_type enum");
  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log("⏭ otp_code_type enum already exists");
    } else {
      throw e;
    }
  }

  // 2. Create the otp_codes table
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "otp_codes" (
        "id" serial PRIMARY KEY NOT NULL,
        "phone" varchar(30) NOT NULL,
        "code" varchar(6) NOT NULL,
        "type" "otp_code_type" NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "used" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `;
    console.log("✓ Created otp_codes table");
  } catch (e: any) {
    console.log("⏭ otp_codes table:", e.message);
  }

  // 3. Add phone column to users table (nullable, unique)
  try {
    await sql`ALTER TABLE "users" ADD COLUMN "phone" varchar(30)`;
    console.log("✓ Added phone column to users");
  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log("⏭ phone column already exists on users");
    } else {
      throw e;
    }
  }

  // 4. Add unique constraint on phone
  try {
    await sql`ALTER TABLE "users" ADD CONSTRAINT "users_phone_unique" UNIQUE("phone")`;
    console.log("✓ Added unique constraint on users.phone");
  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log("⏭ users_phone_unique constraint already exists");
    } else {
      throw e;
    }
  }

  console.log("\n✅ Migration complete!");
}

migrate().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
