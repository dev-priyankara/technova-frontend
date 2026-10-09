
import Link from "next/link";

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0 text-sky-400"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0 text-sky-400"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0 text-sky-400"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950/85 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPinIcon />

            <div>
              <h2 className="text-sm font-bold text-white">Address</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No. 123, Galle Road, Colombo 06, Sri Lanka
              </p>
            </div>
          </div>

          {/* Contact Number */}
          <div className="flex items-start gap-3">
            <PhoneIcon />

            <div>
              <h2 className="text-sm font-bold text-white">
                Contact Number
              </h2>

              <a
                href="tel:+94112345678"
                className="mt-2 inline-block text-sm text-slate-400 transition-colors hover:text-sky-300"
              >
                +94 11 234 5678
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-start gap-3">
            <ClockIcon />

            <div>
              <h2 className="text-sm font-bold text-white">
                Working Hours
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Mon – Sat: 9:00 AM – 8:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Copyright and tagline */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-400">
            © 2026 TECHNOVA Computers. All rights reserved.
          </p>

          <Link
            href="/"
            className="w-fit font-medium text-slate-400 transition-colors hover:text-white"
          >
            Built for your next upgrade.
          </Link>
        </div>
      </div>
    </footer>
  );
}
