"use client";

import { FormEvent, useMemo, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

function formatDefaultPickup() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 90);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now.toISOString().slice(0, 16);
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
    const pickupISO = new Date(pickupTimeInput).toISOString();

    const payload = {
      customerName: String(formData.get("customerName") ?? ""),
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
      <h2 className="text-xl font-semibold text-[#084771]">Book your pickup</h2>
      <p className="text-sm text-[#3d80aa]">
        Fill this out and we will confirm your pickup details by phone or email.
      </p>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Full name</span>
        <input required name="customerName" className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Address</span>
        <textarea required name="address" rows={3} className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Pickup time</span>
        <input required type="datetime-local" name="pickupTime" defaultValue={defaultPickup} className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Phone number</span>
        <input required type="tel" name="phoneNumber" className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Email</span>
        <input required type="email" name="email" className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Additional notes (allergies, preferences, etc.)</span>
        <textarea name="notes" rows={4} className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]" />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-[#ea5d23] px-4 py-2 font-semibold text-white transition hover:bg-[#d6531f] disabled:cursor-not-allowed disabled:bg-[#f2ba1e]"
      >
        {status === "submitting" ? "Submitting..." : "Request pickup"}
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
