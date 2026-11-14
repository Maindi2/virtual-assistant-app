import { useState } from "react";
import { DATA_CLEANING_SAMPLE } from "../data/portfolioData";

export function DataCleaningShowcase() {
  const [viewMode, setViewMode] = useState<"cleaned" | "raw">("cleaned");

  return (
    <section id="capabilities" className="border-b border-slate-200 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-blue-700">
              Precision &amp; Record Organization
            </p>
            <h2 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From unformatted exports to clean, analysis-ready sheets
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Toggle between a typical uncleaned source export and the standardized
              Microsoft Excel / Google Sheets deliverable ready for reporting.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Spreadsheet preview mode"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "raw"}
              onClick={() => setViewMode("raw")}
              className={`min-h-10 rounded-md px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                viewMode === "raw"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Raw Uncleaned Export
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "cleaned"}
              onClick={() => setViewMode("cleaned")}
              className={`min-h-10 rounded-md px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                viewMode === "cleaned"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cleaned &amp; Formatted Sheet
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
            <span className="font-mono font-medium text-slate-800">
              {viewMode === "raw"
                ? "client_records_raw_export.csv"
                : "client_records_master_formatted.xlsx"}
            </span>
            <span className="font-mono tabular-nums">
              {viewMode === "raw"
                ? "4 rows · Mixed dates · 1 duplicate · Unformatted currency"
                : "3 active rows · ISO 8601 dates · Deduplicated · Tabular currency"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600">
                  <th className="px-5 py-3 font-mono tabular-nums">ID</th>
                  <th className="px-5 py-3">Client Name</th>
                  <th className="px-5 py-3">Email Address</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs tabular-nums">
                {DATA_CLEANING_SAMPLE.map((row) => {
                  const isDupCleaned = viewMode === "cleaned" && row.id === "1043";
                  return (
                    <tr
                      key={row.id}
                      className={
                        isDupCleaned
                          ? "bg-slate-50 text-slate-400 line-through"
                          : "bg-white text-slate-800"
                      }
                    >
                      <td className="px-5 py-3.5 text-slate-500">#{row.id}</td>
                      <td className="px-5 py-3.5 font-sans text-sm font-medium">
                        {viewMode === "raw" ? row.rawName : row.cleanName}
                      </td>
                      <td className="px-5 py-3.5">
                        {viewMode === "raw" ? row.rawEmail : row.cleanEmail}
                      </td>
                      <td className="px-5 py-3.5">
                        {viewMode === "raw" ? row.rawDate : row.cleanDate}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {viewMode === "raw" ? row.rawAmount : row.cleanAmount}
                      </td>
                      <td className="px-5 py-3.5 font-sans text-xs">
                        {viewMode === "raw" ? row.rawStatus : row.cleanNote}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
