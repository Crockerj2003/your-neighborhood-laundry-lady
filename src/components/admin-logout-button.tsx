"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-lg border border-[#084771] bg-white px-3 py-2 text-sm font-medium text-[#084771] hover:bg-[#e7f3f4]"
    >
      Log out
    </button>
  );
}
