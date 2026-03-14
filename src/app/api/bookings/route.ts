import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/bookingSchema";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = bookingSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid form data." },
        { status: 400 },
      );
    }

    const booking = await prisma.booking.create({
      data: {
        customerName: parsed.data.customerName,
        address: parsed.data.address,
        pickupTime: new Date(parsed.data.pickupTime),
        phoneNumber: parsed.data.phoneNumber,
        email: parsed.data.email,
        notes: parsed.data.notes || null,
      },
    });

    return NextResponse.json({ bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Could not save booking. Please try again." },
      { status: 500 },
    );
  }
}
