"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to log in.");
      }

      router.push("/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to log in.",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-[#8ad8dd] bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-[#084771]">Admin login</h1>
      <p className="text-sm text-[#3d80aa]">
        Enter your password to view current laundry bookings.
      </p>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#084771]">Password</span>
        <input
          required
          name="password"
          type="password"
          className="w-full rounded-lg border border-[#3d80aa]/50 px-3 py-2 text-black outline-none focus:border-[#084771]"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#084771] px-4 py-2 font-semibold text-white transition hover:bg-[#3d80aa] disabled:cursor-not-allowed disabled:bg-[#8ad8dd]"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      {error && (
        <p className="rounded-lg bg-[#ea5d23]/15 px-3 py-2 text-sm text-[#ea5d23]">{error}</p>
      )}
    </form>
  );
}
