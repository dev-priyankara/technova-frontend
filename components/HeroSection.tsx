import Link from "next/link";

export default function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-36">
        {/* Hero Content */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Your Trusted Computer Store
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Power Your
            <span className="block text-blue-400">
              Next Generation.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Discover powerful computers, high-performance components, and
            essential accessories. Find the right technology for gaming,
            studying, and professional work at TECHNOVA Computers.
          </p>

          {/* Hero Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white px-7 py-3.5 font-semibold text-blue-950 shadow-lg shadow-blue-950/30 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
            >
              Shop Now
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-7 py-3.5 font-semibold text-white transition-colors hover:border-blue-300 hover:bg-white/20"
            >
              Explore Categories
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <p className="text-sm font-bold text-white sm:text-base">
                Quality
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                Trusted hardware
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-white sm:text-base">
                Great Value
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                Competitive prices
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-white sm:text-base">
                Expert Help
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                Product guidance
              </p>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-blue-200/50 blur-3xl" />
          <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-indigo-200/50 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-5 shadow-2xl shadow-blue-950/20 sm:p-8">
            {/* Decorative background */}
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-64 w-64 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -right-12 top-12 h-64 w-64 rounded-full border border-white/10"
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
                    TECHNOVA COLLECTION
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    Built for Performance
                  </h2>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-7 w-7 text-blue-200"
                  >
                    <rect x="3" y="4" width="18" height="13" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
              </div>

              {/* Product tiles */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
                  <div className="flex h-14 items-center text-4xl">
                    <span aria-hidden="true">🎮</span>
                  </div>
                  <p className="mt-3 font-bold text-white">Gaming Gear</p>
                  <p className="mt-1 text-xs leading-5 text-blue-100">
                    Gear up for gaming
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
                  <div className="flex h-14 items-center text-4xl">
                    <span aria-hidden="true">💻</span>
                  </div>
                  <p className="mt-3 font-bold text-white">Laptops</p>
                  <p className="mt-1 text-xs leading-5 text-blue-100">
                    Work and study
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
                  <div className="flex h-14 items-center text-4xl">
                    <span aria-hidden="true">⚡</span>
                  </div>
                  <p className="mt-3 font-bold text-white">PC Components</p>
                  <p className="mt-1 text-xs leading-5 text-blue-100">
                    Upgrade your setup
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
                  <div className="flex h-14 items-center text-4xl">
                    <span aria-hidden="true">🖥️</span>
                  </div>
                  <p className="mt-3 font-bold text-white">Accessories</p>
                  <p className="mt-1 text-xs leading-5 text-blue-100">
                    Complete your desk
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
                <div>
                  <p className="font-semibold text-white">
                    Find your next upgrade
                  </p>
                  <p className="mt-1 text-xs text-blue-100">
                    Explore products for every setup
                  </p>
                </div>

                <Link
                  href="/products"
                  aria-label="Explore computer products"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-950 transition-transform hover:scale-105"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}