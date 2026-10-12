
const benefits = [
  {
    number: "01",
    icon: "🖥️",
    title: "Quality Computer Products",
    description:
      "Explore computer hardware, components and accessories for gaming, work, study and everyday use.",
  },
  {
    number: "02",
    icon: "💰",
    title: "Value for Your Money",
    description:
      "Compare products and choose options that suit your requirements and budget.",
  },
  {
    number: "03",
    icon: "🔍",
    title: "Easy Product Discovery",
    description:
      "Browse organised categories and find the computer products you need without unnecessary hassle.",
  },
  {
    number: "04",
    icon: "🤝",
    title: "Customer-Focused Service",
    description:
      "Get in touch with our team for product enquiries and help choosing suitable computer hardware.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="about"
      aria-labelledby="why-choose-heading"
      className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200 sm:text-sm">
            <span aria-hidden="true" className="text-blue-300">
              ✦
            </span>
            The TECHNOVA Advantage
          </span>

          <h2
            id="why-choose-heading"
            className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Why Choose{" "}
            <span className="text-blue-400">TECHNOVA?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Finding the right computer products should be simple. Explore
            your options, compare what you need and choose products that
            match your goals.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.number}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-950/40 sm:p-7"
            >
              {/* Background number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-3 text-5xl font-black text-white/10 transition-colors duration-300 group-hover:text-blue-400/20"
              >
                {benefit.number}
              </span>

              {/* Icon */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl transition-all duration-300 group-hover:bg-blue-400 group-hover:text-blue-950">
                <span aria-hidden="true">{benefit.icon}</span>
              </div>

              {/* Text */}
                <h3 className="relative mt-6 text-lg font-bold leading-7 text-white">
                {benefit.title}
              </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                {benefit.description}
              </p>

              {/* Bottom accent */}
              <div className="mt-6 h-1 w-10 rounded-full bg-blue-400 transition-all duration-300 group-hover:w-16" />
            </article>
          ))}
        </div>

        {/* Bottom call to action */}
        <div className="mt-12 overflow-hidden rounded-2xl bg-blue-950 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-300">
                Ready to upgrade?
              </p>

              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                Find the right technology for you.
              </h3>

              <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
                Explore our product collection and discover options for
                your next computer setup.
              </p>
            </div>

            <a
              href="/#products"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 font-bold !text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-950"
            >
              Explore Products
              <span aria-hidden="true" className="!text-black">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
