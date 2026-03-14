import { Resend } from "resend";
import { PICKUP_TIME_ZONE } from "@/lib/pickupTime";

type StatusEmailInput = {
  customerName: string;
  customerEmail: string;
  pickupTime: Date;
  newStatus: string;
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
  const formattedPickupTime = formatPickupTimeForEmail(input.pickupTime);
  const subject = `Laundry update: ${input.newStatus}`;

  const text = [
    `Hi ${input.customerName},`,
    "",
    "Your laundry booking status has been updated.",
    `New status: ${input.newStatus}`,
    `Pickup time: ${formattedPickupTime} (Atlantic time)`,
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
