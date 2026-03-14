"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  PICKUP_START_HOUR,
  PICKUP_START_MINUTE,
  isPickupTimeAfterCutoff,
  isPickupTimeBeforeStart,
} from "@/lib/pickupTime";

type Status = "idle" | "submitting" | "success" | "error";

function formatForDateTimeInput(date: Date) {
  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
}

function formatDefaultPickup() {
  const now = new Date();
  const proposedPickup = new Date(now);
  proposedPickup.setMinutes(proposedPickup.getMinutes() + 90);
  proposedPickup.setSeconds(0);
  proposedPickup.setMilliseconds(0);

  if (isPickupTimeBeforeStart(proposedPickup)) {
    proposedPickup.setHours(PICKUP_START_HOUR, PICKUP_START_MINUTE, 0, 0);
  } else if (isPickupTimeAfterCutoff(proposedPickup)) {
    proposedPickup.setDate(proposedPickup.getDate() + 1);
    proposedPickup.setHours(PICKUP_START_HOUR, PICKUP_START_MINUTE, 0, 0);
  }

  return formatForDateTimeInput(proposedPickup);
}

export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const defaultPickup = useMemo(() => formatDefaultPickup(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    const pickupTimeInput = String(formData.get("pickupTime") ?? "");
    const pickupDate = new Date(pickupTimeInput);

    if (Number.isNaN(pickupDate.getTime())) {
      setStatus("error");
      setError("Enter a valid pickup time.");
      return;
    }

    if (isPickupTimeBeforeStart(pickupDate)) {
      setStatus("error");
      setError("Pickup time must be on or after 8:00 AM.");
      return;
    }

    if (isPickupTimeAfterCutoff(pickupDate)) {
      setStatus("error");
      setError("Pickup time must be on or before 6:00 PM.");
      return;
    }

    const pickupISO = pickupDate.toISOString();

    const payload = {
      customerName: String(formData.get("customerName") ?? ""),
      town: String(formData.get("town") ?? ""),
      address: String(formData.get("address") ?? ""),
      pickupTime: pickupISO,
      phoneNumber: String(formData.get("phoneNumber") ?? ""),
      email: String(formData.get("email") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      event.currentTarget.reset();
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not place your booking. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#8ad8dd] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#084771]">Book Your Pickup Time</h2>
      <p className="text-sm text-[#3d80aa]">
        Fill this form out and we will confirm your pickup details by phone or email.
      </p>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Full Name</span>
        <input required name="customerName" className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Town</span>
        <select
          required
          name="town"
          defaultValue=""
          className="w-full rounded-lg border border-[#3d80aa]/50 bg-white px-3 py-2 text-black outline-none focus:border-[#084771]"
        >
          <option value="" disabled>
            Select your town
          </option>
          <option value="Wolfville">Wolfville</option>
          <option value="New Minas">New Minas</option>
          <option value="Kentville">Kentville</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Street Address</span>
        <textarea required name="address" rows={3} className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Pickup Time</span>
        <input required type="datetime-local" name="pickupTime" defaultValue={defaultPickup} className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
        <span className="mt-1 block text-xs text-[#3d80aa]">
          Pickup hours are 8:00 AM to 6:00 PM.
        </span>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Phone Number</span>
        <input required type="tel" name="phoneNumber" className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Email</span>
        <input required type="email" name="email" className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Additional Notes (Allergies, Preferences, etc.)</span>
        <textarea name="notes" rows={4} className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-[#ea5d23] px-4 py-2 font-semibold text-white transition hover:bg-[#d6531f] disabled:cursor-not-allowed disabled:bg-[#f2ba1e]"
      >
        {status === "submitting" ? "Submitting..." : "Request Pickup"}
      </button>

      {status === "success" && (
        <p className="rounded-lg bg-[#8ad8dd]/30 px-3 py-2 text-sm text-[#084771]">
          Booking request sent. You will hear from us shortly.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-[#ea5d23]/15 px-3 py-2 text-sm text-[#ea5d23]">{error}</p>
      )}
    </form>
  );
}
