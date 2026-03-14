import Link from "next/link";
import { BookingForm } from "@/components/booking-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e7f3f4]">
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 md:px-8">
        <section className="space-y-6 rounded-2xl bg-[#084771] p-8 text-white shadow-sm">
          <p className="inline-block rounded-full bg-[#3d80aa] px-3 py-1 text-xs font-semibold tracking-wide text-white">
            Pickup & Delivery Laundry Service
          </p>
          <h1 className="text-4xl font-bold leading-tight">
            Your Neighborhood Laundry Lady
          </h1>
          <p className="text-lg text-[#8ad8dd]">
            Clean Clothes, Less Stress!
          </p>

          <div className="space-y-3 text-sm text-[#e7f3f4]">
            <p>
              Sensitive, skin-approved products and careful handling with each
              order.
            </p>
            <p>
              Book a pickup and let us take laundry off of your to-do list. We'll wash, dry, and fold it, and return it fresh to your door!
            </p>
          </div>

          <div className="rounded-xl border border-[#8ad8dd]/30 bg-[#3d80aa]/30 p-4 text-sm">
            <p className="font-semibold">Service Highlights:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Pickup & Delivery.</li>
              <li>Gentle Detergents Available.</li>
              <li>Returned Fresh to Your Door.</li>
              <li>Local, Friendly Service.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#8ad8dd]/30 bg-[#3d80aa]/30 p-4 text-sm">
            <p className="font-semibold">Pricing:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>$25 per bag.</li>
              <li>A standard bag of laundry is approximately 10 lbs. </li>
              <li>After 30 lbs, we will charge $1.50 per additional lb.</li>
              <li>Accepting Cash or E-Transfer.</li>
              <li>Payment Due Upon Pickup.</li>
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
