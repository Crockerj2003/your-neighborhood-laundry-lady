import { z } from "zod";
import {
  isPickupTimeAfterCutoff,
  isPickupTimeBeforeStart,
} from "@/lib/pickupTime";
import { BOOKING_STATUS_VALUES } from "@/lib/bookingStatus";

export const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "Name is required."),
  town: z.enum(["Wolfville", "New Minas", "Kentville"]),
  address: z.string().trim().min(5, "Street address is required."),
  pickupTime: z
    .string()
    .datetime({ offset: true })
    .refine((value) => !isPickupTimeBeforeStart(new Date(value)), {
      message: "Pickup time must be on or after 8:00 AM.",
    })
    .refine((value) => !isPickupTimeAfterCutoff(new Date(value)), {
      message: "Pickup time must be on or before 6:00 PM.",
    }),
  phoneNumber: z.string().trim().min(7, "Phone number is required."),
  email: z.string().trim().email("Enter a valid email."),
  notes: z.string().trim().max(1500).optional(),
  status: z.enum(BOOKING_STATUS_VALUES).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
