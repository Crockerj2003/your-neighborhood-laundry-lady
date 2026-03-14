import Link from "next/link";
import { BookingForm } from "@/components/booking-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e7f3f4]">
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 md:px-8">
        <section className="space-y-6 rounded-2xl bg-[#084771] p-8 text-white shadow-sm">
          <p className="inline-block rounded-full bg-[#3d80aa] px-3 py-1 text-xs font-semibold tracking-wide text-white">
            Pickup & delivery laundry service
          </p>
          <h1 className="text-4xl font-bold leading-tight">
            Your neighborhood laundry lady
          </h1>
          <p className="text-lg text-[#8ad8dd]">
            clean clothes, less stress
          </p>

          <div className="space-y-3 text-sm text-[#e7f3f4]">
            <p>
              Sensitive skin approved products and careful handling for each
              order.
            </p>
            <p>
              Book a pickup and we will collect your laundry, wash and fold it,
              then deliver it back to your door.
            </p>
          </div>

          <div className="rounded-xl border border-[#8ad8dd]/30 bg-[#3d80aa]/30 p-4 text-sm">
            <p className="font-semibold">Service highlights</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Home pickup at your preferred time</li>
              <li>Skin-sensitive detergents and softeners</li>
              <li>Return delivery once your laundry is ready</li>
            </ul>
          </div>

          <Link
            href="/admin/login"
            className="inline-flex rounded-lg border border-[#f2ba1e] px-4 py-2 text-sm font-medium text-[#f2ba1e] transition hover:bg-[#f2ba1e] hover:text-black"
          >
            Admin portal
          </Link>
        </section>

        <section>
          <BookingForm />
          <p className="mt-4 text-center text-xs text-[#084771]">
            By submitting, you allow us to contact you about this booking.
          </p>
        </section>
      </main>
    </div>
  );
}
