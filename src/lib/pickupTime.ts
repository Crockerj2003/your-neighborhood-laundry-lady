export const PICKUP_START_HOUR = 8;
export const PICKUP_START_MINUTE = 0;
export const PICKUP_CUTOFF_HOUR = 18;
export const PICKUP_CUTOFF_MINUTE = 0;
export const PICKUP_TIME_ZONE = "America/Halifax";

function getTimeZoneParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PICKUP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value ?? "0");
  const month = Number(
    parts.find((part) => part.type === "month")?.value ?? "0",
  );
  const day = Number(parts.find((part) => part.type === "day")?.value ?? "0");
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");

  return { year, month, day, hour, minute };
}

function getMinutesFromDate(pickupDate: Date) {
  const parts = getTimeZoneParts(pickupDate);
  return parts.hour * 60 + parts.minute;
}

export function buildPickupDateInTimeZone(dateInput: string, timeInput: string) {
  const [year, month, day] = dateInput.split("-").map(Number);
  const [hour, minute] = timeInput.split(":").map(Number);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return new Date("");
  }

  const naiveUtcTimestamp = Date.UTC(year, month - 1, day, hour, minute, 0, 0);

  // Search UTC minute offsets to find the instant matching
  // the intended wall-clock time in Atlantic time.
  for (let offsetMinutes = -14 * 60; offsetMinutes <= 14 * 60; offsetMinutes++) {
    const candidateDate = new Date(naiveUtcTimestamp + offsetMinutes * 60_000);
    const candidateParts = getTimeZoneParts(candidateDate);

    if (
      candidateParts.year === year &&
      candidateParts.month === month &&
      candidateParts.day === day &&
      candidateParts.hour === hour &&
      candidateParts.minute === minute
    ) {
      return candidateDate;
    }
  }

  return new Date("");
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
