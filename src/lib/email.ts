import { Resend } from "resend";
import { PICKUP_TIME_ZONE } from "@/lib/pickupTime";

type StatusEmailInput = {
  customerName: string;
  customerEmail: string;
  newStatus: string;
};

type BookingPlacedEmailInput = {
  customerName: string;
  customerEmail: string;
  address: string;
  pickupTime: Date;
  phoneNumber: string;
  notes: string | null;
};

function formatPickupTimeForEmail(pickupTime: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PICKUP_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(pickupTime);
}

export async function sendBookingStatusEmail(input: StatusEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!apiKey || !emailFrom) {
    console.warn(
      "Skipping booking status email because RESEND_API_KEY or EMAIL_FROM is missing.",
    );
    return;
  }

  const resend = new Resend(apiKey);
  const subject = `Laundry update: ${input.newStatus}`;

  const text = [
    `Hi ${input.customerName},`,
    "",
    "Your laundry booking status has been updated.",
    `New status: ${input.newStatus}`,
    "",
    "Thank you,",
    "Your Neighborhood Laundry Lady",
  ].join("\n");

  await resend.emails.send({
    from: emailFrom,
    to: [input.customerEmail],
    subject,
    text,
  });
}

export async function sendBookingPlacedEmails(input: BookingPlacedEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const bookingAlertEmail =
    process.env.BOOKING_ALERT_EMAIL ?? "okeefetmackenzie@gmail.com";

  if (!apiKey || !emailFrom) {
    console.warn(
      "Skipping booking confirmation email because RESEND_API_KEY or EMAIL_FROM is missing.",
    );
    return;
  }

  const resend = new Resend(apiKey);
  const formattedPickupTime = formatPickupTimeForEmail(input.pickupTime);
  const notesText = input.notes?.trim() ? input.notes : "None";

  const customerText = [
    `Hi ${input.customerName},`,
    "",
    "Thanks for your booking request. We received it and will be in touch soon.",
    "",
    `Pickup time: ${formattedPickupTime} (Atlantic time)`,
    `Address: ${input.address}`,
    "",
    "Thank you,",
    "Your Neighborhood Laundry Lady",
  ].join("\n");

  const ownerText = [
    "A new booking has been placed.",
    "",
    `Customer: ${input.customerName}`,
    `Email: ${input.customerEmail}`,
    `Phone: ${input.phoneNumber}`,
    `Pickup time: ${formattedPickupTime} (Atlantic time)`,
    `Address: ${input.address}`,
    `Notes: ${notesText}`,
  ].join("\n");

  await Promise.all([
    resend.emails.send({
      from: emailFrom,
      to: [input.customerEmail],
      subject: "Booking received - Your Neighborhood Laundry Lady",
      text: customerText,
    }),
    resend.emails.send({
      from: emailFrom,
      to: [bookingAlertEmail],
      subject: `New booking: ${input.customerName}`,
      text: ownerText,
    }),
  ]);
}
