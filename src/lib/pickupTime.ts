export const PICKUP_START_HOUR = 8;
export const PICKUP_START_MINUTE = 0;
export const PICKUP_CUTOFF_HOUR = 18;
export const PICKUP_CUTOFF_MINUTE = 0;
export const PICKUP_TIME_ZONE = "America/Halifax";

function getMinutesFromDate(pickupDate: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PICKUP_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(pickupDate);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? "0",
  );

  return hour * 60 + minute;
}

function getPickupStartMinutes() {
  return PICKUP_START_HOUR * 60 + PICKUP_START_MINUTE;
}

function getPickupCutoffMinutes() {
  return PICKUP_CUTOFF_HOUR * 60 + PICKUP_CUTOFF_MINUTE;
}

export function isPickupTimeBeforeStart(pickupDate: Date) {
  return getMinutesFromDate(pickupDate) < getPickupStartMinutes();
}

export function isPickupTimeAfterCutoff(pickupDate: Date) {
  return getMinutesFromDate(pickupDate) > getPickupCutoffMinutes();
}
