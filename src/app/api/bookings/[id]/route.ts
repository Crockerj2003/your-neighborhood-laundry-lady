import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/adminAuth";
import { BOOKING_STATUS_VALUES } from "@/lib/bookingStatus";
import { sendBookingStatusEmail } from "@/lib/email";

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

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: parsed.data.status,
      },
    });

    if (existingBooking.status !== updatedBooking.status) {
      try {
        await sendBookingStatusEmail({
          customerName: updatedBooking.customerName,
          customerEmail: updatedBooking.email,
          pickupTime: updatedBooking.pickupTime,
          newStatus: updatedBooking.status,
        });
      } catch (emailError) {
        console.error("Failed to send status update email:", emailError);
      }
    }

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
