import { ArrowUpRight, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SERVICES, type ServiceCategory } from "../data/portfolioData";

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

const FILTER_TABS: { id: ServiceCategory; label: string }[] = [
  { id: "all", label: "All Services" },
  { id: "data", label: "Data & Spreadsheets" },
  { id: "research", label: "Research & Documents" },
  { id: "admin", label: "Admin & Web" },
];

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ServiceCategory>("all");
  const [expandedNumber, setExpandedNumber] = useState<string>("01");

  const filteredServices =
    activeFilter === "all"
      ? SERVICES
      : SERVICES.filter((service) => service.category === activeFilter);

  return (
    <section id="services" className="border-b border-slate-200 bg-[#F8FAFC] py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-blue-700">What I Can Help You With</p>
            <h2 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Eight specialized areas of remote administrative and data support
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter services by category"
            className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`min-h-9 rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {filteredServices.map((service) => {
            const isExpanded = expandedNumber === service.number;
            return (
              <div key={service.number} className="transition-colors duration-150">
                <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedNumber((prev) =>
                        prev === service.number ? "" : service.number
                      )
                    }
                    className="flex flex-1 items-start gap-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
                  >
                    <span className="mt-0.5 font-mono text-sm font-medium tabular-nums text-blue-700">
                      {service.number}.
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-lg font-semibold text-slate-900">
                          {service.title}
                        </h3>
                        <span className="text-xs text-slate-500">
                          {service.categoryLabel}
                        </span>
                      </div>
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
                        {service.summary}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectService(service.title)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-blue-700 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      <span>Request This Service</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      aria-label={
                        isExpanded
                          ? `Collapse details for ${service.title}`
                          : `Expand details for ${service.title}`
                      }
                      onClick={() =>
                        setExpandedNumber((prev) =>
                          prev === service.number ? "" : service.number
                        )
                      }
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:pl-16">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <p className="text-xs font-semibold text-slate-700">
                          Typical Deliverables
                        </p>
                        <ul className="mt-2.5 space-y-2">
                          {service.deliverables.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm text-slate-700"
                            >
                              <Check
                                className="mt-0.5 h-4 w-4 shrink-0 text-blue-700"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Primary Tools
                        </p>
                        <p className="mt-2 text-sm text-slate-600">{service.tools}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
