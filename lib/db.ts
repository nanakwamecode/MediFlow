import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

let migrationPromise: Promise<void> | null = null;
export async function ensureVitalsColumns(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = (async () => {
      try {
        await sql`ALTER TABLE vitals ADD COLUMN IF NOT EXISTS height REAL;`;
        await sql`ALTER TABLE vitals ADD COLUMN IF NOT EXISTS bmi REAL;`;
      } catch (err) {
        console.error("Failed to ensure vitals columns:", err);
      }
    })();
  }
  return migrationPromise;
}
