import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-6">
        <a
          href="#top"
          className="whitespace-nowrap shrink-0 font-display text-lg font-bold tracking-tight text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          Jared Maindi
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#services"
            className="whitespace-nowrap shrink-0 py-2 transition-colors duration-150 hover:text-slate-900 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          >
            Services
          </a>
          <a
            href="#capabilities"
            className="whitespace-nowrap shrink-0 py-2 transition-colors duration-150 hover:text-slate-900 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          >
            Data Cleaning
          </a>
          <a
            href="#video-studio"
            className="whitespace-nowrap shrink-0 py-2 transition-colors duration-150 hover:text-slate-900 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          >
            Video Studio
          </a>
          <a
            href="#about"
            className="whitespace-nowrap shrink-0 py-2 transition-colors duration-150 hover:text-slate-900 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          >
            About
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="hidden md:inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Request Support
          </a>

          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors duration-150 hover:bg-slate-50 md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-11 items-center text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Services
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-11 items-center text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Data Cleaning
            </a>
            <a
              href="#video-studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-11 items-center text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Video Studio
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-11 items-center text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Request Support
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
