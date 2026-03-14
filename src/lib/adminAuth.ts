import { createHash } from "node:crypto";

export const ADMIN_COOKIE_NAME = "ynll_admin_session";

export function getAdminSessionValue() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not set.");
  }

  return createHash("sha256").update(password).digest("hex");
}

export function isAdminSession(cookieValue: string | undefined) {
  if (!cookieValue) {
    return false;
  }

  try {
    return cookieValue === getAdminSessionValue();
  } catch {
    return false;
  }
}
