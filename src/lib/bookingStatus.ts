export const BOOKING_STATUS_VALUES = [
  "Picking up",
  "Washing",
  "Out for delivery",
  "Delivered",
] as const;

export type BookingStatus = (typeof BOOKING_STATUS_VALUES)[number];

export function getSafeBookingStatus(status: string): BookingStatus {
  if (
    BOOKING_STATUS_VALUES.includes(status as BookingStatus)
  ) {
    return status as BookingStatus;
  }

  return "Picking up";
}
