import { z } from "zod";

export const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "Name is required."),
  address: z.string().trim().min(5, "Address is required."),
  pickupTime: z.string().datetime({ offset: true }),
  phoneNumber: z.string().trim().min(7, "Phone number is required."),
  email: z.string().trim().email("Enter a valid email."),
  notes: z.string().trim().max(1500).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
