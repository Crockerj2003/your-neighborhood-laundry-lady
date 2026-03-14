import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminLoginForm } from "@/components/admin-login-form";
import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/adminAuth";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const isLoggedIn = isAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  if (isLoggedIn) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#e7f3f4] px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-4">
        <Link href="/" className="text-sm text-[#084771] hover:text-[#ea5d23] hover:underline">
          Back to booking page
        </Link>
        <AdminLoginForm />
      </div>
    </main>
  );
}
