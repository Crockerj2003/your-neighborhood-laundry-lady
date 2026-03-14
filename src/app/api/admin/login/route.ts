import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionValue } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password?.trim();
    const configuredPassword = process.env.ADMIN_PASSWORD;

    if (!configuredPassword) {
      return NextResponse.json(
        { error: "Admin password is not configured on the server." },
        { status: 500 },
      );
    }

    if (!password || password !== configuredPassword) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, getAdminSessionValue(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to log in:", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
