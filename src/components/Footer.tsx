export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-bold text-slate-900">Jared Maindi</p>
          <p className="mt-1 text-xs text-slate-500">
            Virtual Assistant &amp; Data Entry Specialist · Kenya ·{" "}
            <a
              href="mailto:maindijared2@gmail.com"
              className="hover:text-slate-800 hover:underline"
            >
              maindijared2@gmail.com
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
          <a href="#services" className="hover:text-slate-900">
            Services
          </a>
          <a href="#capabilities" className="hover:text-slate-900">
            Data Cleaning
          </a>
          <a href="#video-studio" className="hover:text-slate-900">
            Video Studio
          </a>
          <a href="#contact" className="hover:text-slate-900">
            Contact
          </a>
          <span className="text-slate-400">© {year}</span>
        </nav>
      </div>
    </footer>
  );
}
