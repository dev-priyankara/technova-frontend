"use client";

import Link from "next/link";
import { useState } from "react";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900 text-xl font-extrabold text-white">
            T
          </div>

          <div>
            <span className="block text-lg font-extrabold tracking-tight text-white sm:text-xl">
              TECHNOVA
            </span>
            <span className="block text-xs font-medium tracking-[0.2em] text-blue-300">
              COMPUTERS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-white transition-colors hover:text-blue-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Search */}
        <div className="hidden max-w-xs flex-1 xl:flex">
          <form
            action="/products"
            method="GET"
            className="flex w-full items-center rounded-lg border border-white/10 bg-white/5 px-3"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5 shrink-0 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="search"
              name="search"
              placeholder="Search products..."
              aria-label="Search products"
                className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-400"
            />
          </form>
        </div>

        {/* Account and Cart */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-white transition-colors hover:text-blue-300 sm:inline-flex"
          >
            Login
          </Link>

          <Link
            href="/register"
              className="hidden rounded-lg border border-white/20 bg-white px-4 py-2.5 text-sm font-semibold text-blue-950 transition-colors hover:border-blue-300 hover:bg-blue-50 md:inline-flex"
          >
            Register
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white text-blue-950 transition-colors hover:border-blue-300 hover:bg-blue-50"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </Link>

          {/* Mobile / Tablet Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Navigation Menu */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-white/10 bg-slate-950/95 px-4 py-4 shadow-lg backdrop-blur-md lg:hidden sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 font-medium text-white transition-colors hover:bg-blue-500/10 hover:text-blue-200"
              >
                {link.name}
              </Link>
            ))}

            {/* Search on mobile */}
            <form
              action="/products"
              method="GET"
              className="mt-2 flex items-center rounded-lg border border-white/10 bg-white/5 px-3"
            >
              <input
                type="search"
                name="search"
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full bg-transparent px-2 py-3 text-sm text-white outline-none"
              />

              <button
                type="submit"
                aria-label="Search"
                className="text-white"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            </form>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-blue-400/40 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-500/10"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-white/20 bg-white px-4 py-3 text-center font-semibold text-blue-950 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}