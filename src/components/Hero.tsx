import { ArrowRight, Film, User } from "lucide-react";
import { useState } from "react";

export function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p className="text-sm font-medium text-blue-700">
                Virtual Assistant &amp; Data Entry Specialist · Kenya
              </p>

              <h1
                className="mt-4 max-w-2xl text-balance font-display font-bold tracking-tight text-slate-900"
                style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)", lineHeight: 1.08 }}
              >
                Accurate records, organized spreadsheets, dependable remote support.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
                I am a dedicated and detail-oriented Virtual Assistant and Data Entry Specialist
                based in Kenya, passionate about helping businesses and individuals stay organized,
                productive, and efficient.
              </p>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                My goal is to make work easier for clients by providing accurate results, clear
                communication, and dependable remote support within agreed deadlines.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 pt-2">
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href="#video-studio"
                className="inline-flex min-h-11 items-center gap-2 px-2 py-2 text-sm font-semibold text-slate-800 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <Film className="h-4 w-4 text-blue-700" aria-hidden="true" />
                <span>Animate Photo into Video</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="relative flex-1 min-h-[340px] w-full overflow-hidden bg-slate-100">
                {!imgError ? (
                  <img
                    src="/assets/aistudio/Jay_85fb1e37.png"
                    alt="Jared Maindi, Virtual Assistant and Data Entry Specialist based in Kenya"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full min-h-[340px] flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-slate-200 p-8 text-center">
                    <User className="h-10 w-10 text-slate-400" aria-hidden="true" />
                    <span className="font-display text-base font-semibold text-slate-700">
                      Jared Maindi
                    </span>
                  </div>
                )}
              </div>
              <figcaption className="flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-5 py-3.5 text-xs text-slate-600">
                <span className="font-medium text-slate-900">Jared Maindi</span>
                <span className="tabular-nums">Nairobi, Kenya · EAT (UTC+3)</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 border-t border-slate-200 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-mono text-xs font-medium text-slate-500">01 / Spreadsheets</p>
            <p className="mt-1.5 font-display text-base font-semibold text-slate-900">
              Excel &amp; Google Sheets
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Formatting, formulas, validation, and structured workbooks.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs font-medium text-slate-500">02 / Hygiene</p>
            <p className="mt-1.5 font-display text-base font-semibold text-slate-900">
              Data Cleaning &amp; Entry
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Deduplication, standardized records, and verified collection.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs font-medium text-slate-500">03 / Documents</p>
            <p className="mt-1.5 font-display text-base font-semibold text-slate-900">
              Word &amp; PDF Conversion
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Cleanly formatted documents and accurate PDF-to-Excel extracts.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs font-medium text-slate-500">04 / Operations</p>
            <p className="mt-1.5 font-display text-base font-semibold text-slate-900">
              Admin &amp; Web Updates
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Inbox coordination, web research, and routine CMS publishing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
