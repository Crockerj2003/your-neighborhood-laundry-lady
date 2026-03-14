import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/adminAuth";
import { BOOKING_STATUS_VALUES } from "@/lib/bookingStatus";

const updateBookingSchema = z.object({
  status: z.enum(BOOKING_STATUS_VALUES),
});

async function requireAdminSession() {
  const cookieStore = await cookies();
  const isLoggedIn = isAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  if (!isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorizedResponse = await requireAdminSession();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const { id } = await context.params;

  try {
    const payload = await request.json();
    const parsed = updateBookingSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid form data." },
        { status: 400 },
      );
    }

    await prisma.booking.update({
      where: { id },
      data: {
        status: parsed.data.status,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update booking:", error);
    return NextResponse.json(
      { error: "Could not update booking." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorizedResponse = await requireAdminSession();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const { id } = await context.params;

  try {
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return NextResponse.json(
      { error: "Could not delete booking." },
      { status: 500 },
    );
  }
}
