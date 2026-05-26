import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const isDbConfigured = !!process.env.DATABASE_URL;

const sql = isDbConfigured ? neon(process.env.DATABASE_URL!) : null;
export const db = isDbConfigured && sql ? drizzle(sql, { schema }) : null as any;

