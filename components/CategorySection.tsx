import Link from "next/link";

const categories = [
  {
    name: "Laptops",
    description: "Powerful laptops for work, study and gaming.",
    icon: "💻",
    href: "/categories/laptops",
    accent: "bg-blue-50",
  },
  {
    name: "Processors",
    description: "Explore CPUs for powerful computing performance.",
    icon: "⚡",
    href: "/categories/processors",
    accent: "bg-indigo-50",
  },
  {
    name: "Graphics Cards",
    description: "Experience stunning graphics and smooth gaming.",
    icon: "🎮",
    href: "/categories/graphics-cards",
    accent: "bg-violet-50",
  },
  {
    name: "Motherboards",
    description: "Build a reliable foundation for your PC.",
    icon: "🔌",
    href: "/categories/motherboards",
    accent: "bg-sky-50",
  },
  {
    name: "Memory (RAM)",
    description: "Improve multitasking and system performance.",
    icon: "🧠",
    href: "/categories/ram",
    accent: "bg-cyan-50",
  },
  {
    name: "Storage",
    description: "Fast SSDs and reliable storage solutions.",
    icon: "💾",
    href: "/categories/storage",
    accent: "bg-emerald-50",
  },
  {
    name: "Monitors",
    description: "Find the right display for your setup.",
    icon: "🖥️",
    href: "/categories/monitors",
    accent: "bg-amber-50",
  },
  {
    name: "Gaming Accessories",
    description: "Keyboards, mice, headsets and more.",
    icon: "🎧",
    href: "/categories/gaming-accessories",
    accent: "bg-rose-50",
  },
];

export default function CategorySection() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-900 sm:text-sm">
            Explore TECHNOVA
          </span>

          <h2
            id="categories-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Explore Our{" "}
            <span className="text-blue-900">Categories</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Discover computer hardware, components and accessories
            to build, upgrade and enhance your setup.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 sm:p-6"
            >
              {/* Category Icon */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.accent} transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16`}
              >
                <span
                  aria-hidden="true"
                  className="text-3xl sm:text-4xl"
                >
                  {category.icon}
                </span>
              </div>

              {/* Category Details */}
              <h3 className="mt-5 text-base font-bold text-slate-900 transition-colors group-hover:text-blue-900 sm:text-lg">
                {category.name}
              </h3>

              <p className="mt-2 flex-1 text-xs leading-6 text-slate-600 sm:text-sm">
                {category.description}
              </p>

              {/* Explore Link */}
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-900">
                <span>Explore</span>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse All Categories */}
        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-900 hover:bg-blue-50 hover:text-blue-900"
          >
            Browse All Categories

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}