import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/adminAuth";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminBookingActions } from "@/components/admin-booking-actions";
import { getSafeBookingStatus } from "@/lib/bookingStatus";

export const dynamic = "force-dynamic";

function formatPickup(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusBadgeStyles(status: string) {
  switch (status) {
    case "Picking up":
      return "bg-[#8ad8dd]/30 text-[#084771] border border-[#8ad8dd]";
    case "Washing":
      return "bg-[#f2ba1e]/20 text-[#9a5f00] border border-[#f2ba1e]/50";
    case "Out for delivery":
      return "bg-[#3d80aa]/20 text-[#084771] border border-[#3d80aa]/40";
    case "Delivered":
      return "bg-[#34a853]/15 text-[#1f7a3d] border border-[#34a853]/40";
    default:
      return "bg-[#e7f3f4] text-[#084771] border border-[#8ad8dd]/40";
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = isAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  let bookings: Awaited<ReturnType<typeof prisma.booking.findMany>> = [];
  let loadError = "";

  try {
    bookings = await prisma.booking.findMany({
      orderBy: [{ pickupTime: "asc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("Failed to load admin bookings:", error);
    loadError = "Could not load bookings right now. Please check database settings and try again.";
  }

  return (
    <main className="min-h-screen bg-[#e7f3f4] px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#084771]">Admin portal</h1>
            <p className="text-sm text-[#3d80aa]">
              Manage bookings for Your neighborhood laundry lady.
            </p>
          </div>
          <AdminLogoutButton />
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#8ad8dd] bg-white shadow-sm">
          {loadError && (
            <div className="border-b border-[#e7f3f4] bg-[#ea5d23]/10 px-4 py-3 text-sm text-[#ea5d23]">
              {loadError}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#084771] text-xs uppercase tracking-wide text-white">
                <tr>
                  <th className="px-4 py-3">Pickup time</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const safeStatus = getSafeBookingStatus(booking.status);
                  return (
                    <tr key={booking.id} className="border-t border-[#e7f3f4] align-top">
                      <td className="px-4 py-3 text-[#084771]">
                        {formatPickup(booking.pickupTime)}
                      </td>
                      <td className="px-4 py-3 font-medium text-black">
                        {booking.customerName}
                      </td>
                      <td className="px-4 py-3 text-black">{booking.phoneNumber}</td>
                      <td className="px-4 py-3 text-black">
                        <a href={`mailto:${booking.email}`} className="text-[#3d80aa] hover:text-[#ea5d23] hover:underline">
                          {booking.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-black">{booking.address}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeStyles(safeStatus)}`}
                        >
                          {safeStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-black">
                        {booking.notes || <span className="text-[#3d80aa]">None</span>}
                      </td>
                      <td className="px-4 py-3">
                        <AdminBookingActions
                          bookingId={booking.id}
                          currentStatus={safeStatus}
                        />
                      </td>
                    </tr>
                  );
                })}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-[#3d80aa]">
                      No bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
