export const PICKUP_START_HOUR = 8;
export const PICKUP_START_MINUTE = 0;
export const PICKUP_CUTOFF_HOUR = 18;
export const PICKUP_CUTOFF_MINUTE = 0;

function getMinutesFromDate(pickupDate: Date) {
  return pickupDate.getHours() * 60 + pickupDate.getMinutes();
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
