"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BOOKING_STATUS_VALUES,
  BookingStatus,
  getSafeBookingStatus,
} from "@/lib/bookingStatus";

type Props = {
  bookingId: string;
  currentStatus: string;
};

export function AdminBookingActions({ bookingId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus>(
    getSafeBookingStatus(currentStatus),
  );
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(nextStatus: BookingStatus) {
    setSavingStatus(true);
    setError("");

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update status.");
      }

      setStatus(nextStatus);
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update status.",
      );
    } finally {
      setSavingStatus(false);
    }
  }

  async function deleteBooking() {
    const confirmed = window.confirm(
      "Delete this booking request? This cannot be undone.",
    );
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete booking.");
      }

      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete booking.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-2">
      <select
        value={status}
        disabled={savingStatus || deleting}
        onChange={(event) => {
          const nextStatus = event.target.value as BookingStatus;
          void updateStatus(nextStatus);
        }}
        className="w-full rounded-lg border border-[#3d80aa]/50 bg-white px-2 py-1 text-xs text-black outline-none focus:border-[#084771]"
      >
        {BOOKING_STATUS_VALUES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={savingStatus || deleting}
        onClick={() => void deleteBooking()}
        className="w-full rounded-lg bg-[#ea5d23] px-2 py-1 text-xs font-semibold text-white transition hover:bg-[#d6531f] disabled:cursor-not-allowed disabled:bg-[#f2ba1e]"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      {error && <p className="text-xs text-[#ea5d23]">{error}</p>}
    </div>
  );
}
