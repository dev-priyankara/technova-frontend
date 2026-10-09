
export default function PromoBanner() {
  return (
    <section
      aria-labelledby="promo-heading"
      className="overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-950">
        {/* Decorative background elements */}
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96"
        />

        <div
          aria-hidden="true"
          className="absolute -right-8 -top-12 h-56 w-56 rounded-full border border-white/10 sm:h-72 sm:w-72"
        />

        <div
          aria-hidden="true"
          className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-blue-700/20 blur-3xl"
        />

        <div className="relative grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-16">
          {/* Promotion details */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              TECHNOVA Special Offer
            </span>

            <h2
              id="promo-heading"
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Upgrade Your
              <span className="block text-sky-300">Gaming Setup.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
              Get ready for your next level of gaming with selected computer
              hardware and accessories at special promotional prices.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                  Selected Items
                </p>

                <p className="mt-1 text-3xl font-black text-white sm:text-4xl">
                  15% OFF
                </p>
              </div>

              <p className="max-w-40 text-sm leading-6 text-blue-100">
                Discover special deals on selected gaming products.
              </p>
            </div>

            <a
              href="/products"
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-950 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-950"
            >
              Shop Now
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </a>

            <p className="mt-4 text-xs leading-5 text-blue-200">
              Demo promotional content. Actual discounts and eligibility must
              be confirmed by the backend before checkout.
            </p>
          </div>

          {/* Decorative gaming illustration made with CSS */}
          <div
            aria-hidden="true"
            className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center sm:min-h-80"
          >
            {/* Glow */}
            <div className="absolute h-56 w-56 rounded-full bg-sky-400/20 blur-3xl sm:h-72 sm:w-72" />

            {/* Monitor */}
            <div className="relative z-10 w-full max-w-sm">
              <div className="rounded-2xl border border-white/20 bg-slate-900 p-3 shadow-2xl shadow-black/30">
                <div className="relative flex aspect-[5/3] items-center justify-center overflow-hidden rounded-xl border border-sky-300/20 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-950">
                  <div className="absolute h-40 w-40 rounded-full border border-sky-300/20 sm:h-48 sm:w-48" />
                  <div className="absolute h-28 w-28 rounded-full border border-sky-300/30 sm:h-36 sm:w-36" />
                  <div className="absolute h-16 w-16 rounded-full bg-sky-400/20 blur-xl" />

                  <div className="relative text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
                      Power
                    </p>

                    <p className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
                      UP
                    </p>

                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-sky-400" />
                  </div>
                </div>
              </div>

              {/* Monitor stand */}
              <div className="mx-auto h-8 w-12 bg-gradient-to-b from-slate-400 to-slate-600" />
              <div className="mx-auto h-2 w-28 rounded-full bg-slate-400" />

              {/* Keyboard */}
              <div className="mx-auto mt-5 grid max-w-xs grid-cols-10 gap-1 rounded-xl border border-white/20 bg-slate-900 p-3 shadow-xl">
                {Array.from({ length: 30 }, (_, index) => (
                  <span
                    key={index}
                    className={`h-2 rounded-sm ${
                      index % 5 === 0
                        ? "bg-sky-400"
                        : "bg-slate-500"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating discount label */}
            <div className="absolute right-0 top-3 z-20 rotate-6 rounded-2xl border border-white/20 bg-white px-4 py-3 shadow-xl sm:right-2 sm:top-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Gaming Week
              </p>

              <p className="text-xl font-black text-blue-950">
                SAVE MORE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
