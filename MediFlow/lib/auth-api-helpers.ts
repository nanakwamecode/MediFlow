import { NextRequest } from "next/server";

/** Matches `lib/schema.ts` — users.username */
export const USERNAME_MAX = 100;
/** Matches `lib/schema.ts` — users.displayName */
export const DISPLAY_NAME_MAX = 200;
export const PASSWORD_MIN = 4;
/** Reasonable upper bound to avoid huge payloads / bcrypt cost */
export const PASSWORD_MAX = 128;

export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
}

export async function readJsonBody(
  req: NextRequest
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  try {
    const data = await req.json();
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Invalid JSON body." };
  }
}

function trimOrEmpty(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function validateLoginBody(data: unknown):
  | { ok: true; username: string; password: string }
  | { ok: false; error: string } {
  if (data === null || typeof data !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const o = data as Record<string, unknown>;
  const username = trimOrEmpty(o.username);
  const password = typeof o.password === "string" ? o.password : "";

  if (!username || !password) {
    return { ok: false, error: "Username and password are required." };
  }
  if (username.length > USERNAME_MAX) {
    return {
      ok: false,
      error: `Username must be at most ${USERNAME_MAX} characters.`,
    };
  }
  if (password.length > PASSWORD_MAX) {
    return {
      ok: false,
      error: `Password must be at most ${PASSWORD_MAX} characters.`,
    };
  }
  return { ok: true, username, password };
}

export function validateRegisterBody(data: unknown):
  | {
      ok: true;
      username: string;
      password: string;
      displayName: string;
    }
  | { ok: false; error: string } {
  if (data === null || typeof data !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const o = data as Record<string, unknown>;
  const username = trimOrEmpty(o.username);
  const password = typeof o.password === "string" ? o.password : "";
  const rawDisplay = o.displayName;
  const displayTrim =
    typeof rawDisplay === "string" && rawDisplay.trim()
      ? rawDisplay.trim()
      : username;

  if (!username || !password) {
    return { ok: false, error: "Username and password are required." };
  }
  if (username.length > USERNAME_MAX) {
    return {
      ok: false,
      error: `Username must be at most ${USERNAME_MAX} characters.`,
    };
  }
  if (password.length < PASSWORD_MIN) {
    return {
      ok: false,
      error: `Password must be at least ${PASSWORD_MIN} characters.`,
    };
  }
  if (password.length > PASSWORD_MAX) {
    return {
      ok: false,
      error: `Password must be at most ${PASSWORD_MAX} characters.`,
    };
  }
  if (displayTrim.length > DISPLAY_NAME_MAX) {
    return {
      ok: false,
      error: `Display name must be at most ${DISPLAY_NAME_MAX} characters.`,
    };
  }
  return { ok: true, username, password, displayName: displayTrim };
}

export function validatePatchMeBody(data: unknown):
  | { ok: true; displayName: string }
  | { ok: false; error: string } {
  if (data === null || typeof data !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const o = data as Record<string, unknown>;
  const displayName = trimOrEmpty(o.displayName);

  if (!displayName) {
    return { ok: false, error: "Display name is required." };
  }
  if (displayName.length > DISPLAY_NAME_MAX) {
    return {
      ok: false,
      error: `Display name must be at most ${DISPLAY_NAME_MAX} characters.`,
    };
  }
  return { ok: true, displayName };
}

export function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"
  );
}
