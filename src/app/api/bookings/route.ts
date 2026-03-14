import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { bookingSchema } from "@/lib/bookingSchema";
import { getSafeBookingStatus } from "@/lib/bookingStatus";
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
        address: `${parsed.data.address}, ${parsed.data.town}`,
        pickupTime: new Date(parsed.data.pickupTime),
        phoneNumber: parsed.data.phoneNumber,
        email: parsed.data.email,
        notes: parsed.data.notes,
        status: getSafeBookingStatus(parsed.data.status ?? "Picking up"),
      },
    });

    return NextResponse.json({ bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P1001") {
        return NextResponse.json(
          {
            error:
              "Could not connect to the database server. Check DATABASE_URL/POSTGRES_PRISMA_URL and sslmode=require.",
          },
          { status: 500 },
        );
      }

      if (error.code === "P1011") {
        return NextResponse.json(
          {
            error:
              "Database TLS handshake failed. Use the Supabase pooler connection string and include sslmode=require&uselibpqcompat=true.",
          },
          { status: 500 },
        );
      }

      if (error.code === "P2021") {
        return NextResponse.json(
          {
            error:
              "The bookings table was not found in the database. Create the Booking table and try again.",
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { error: "Could not save booking. Please try again." },
      { status: 500 },
    );
  }
}
