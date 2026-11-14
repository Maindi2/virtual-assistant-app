import { CheckCircle2, Mail, MapPin, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { SERVICES } from "../data/portfolioData";

interface ContactSectionProps {
  selectedService: string;
}

interface InquiryReceipt {
  referenceId: string;
  name: string;
  email: string;
  service: string;
}

export function ContactSection({ selectedService }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(SERVICES[0].title);
  const [timeline, setTimeline] = useState("This week");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<InquiryReceipt | null>(null);

  useEffect(() => {
    if (selectedService) {
      setService(selectedService);
      setReceipt(null);
    }
  }, [selectedService]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please complete your name, email address, and project details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service,
          timeline,
          message: message.trim(),
        }),
      });
      const data = (await response.json()) as InquiryReceipt & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to send inquiry.");
      }

      setReceipt(data);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="about" className="border-b border-slate-200 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-blue-700">About &amp; Work Approach</p>
            <h2 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-slate-900">
              Consistent quality, clear communication, and on-time delivery
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                I am comfortable working with digital tools, organizing information, maintaining
                accurate records, and completing tasks within agreed deadlines.
              </p>
              <p>
                I am committed to continuous learning, professional growth, and delivering quality
                work on every project. Let&apos;s work together to get things done efficiently.
              </p>
            </div>

            <div className="mt-8 space-y-4 border-t border-slate-200 pt-6 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
                <span>Based in Kenya · Remote worldwide (EAT / UTC+3)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
                <a
                  href="mailto:maindijared2@gmail.com"
                  className="font-medium text-slate-900 hover:text-blue-700 hover:underline hover:underline-offset-4"
                >
                  maindijared2@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div id="contact" className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Request Virtual Assistance or Data Support
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                Share the task, preferred format (Excel, Google Sheets, Word, or CMS), and target
                deadline.
              </p>

              {receipt ? (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-display text-base font-semibold text-slate-900">
                        Inquiry Recorded ({receipt.referenceId})
                      </p>
                      <p className="mt-1.5 text-sm text-slate-600">
                        Thank you, {receipt.name}. Your request for{" "}
                        <span className="font-medium text-slate-900">{receipt.service}</span> has
                        been logged for follow-up at {receipt.email}.
                      </p>
                      <button
                        type="button"
                        onClick={() => setReceipt(null)}
                        className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                      >
                        Send Another Request
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Njeri"
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-service"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Service Needed
                      </label>
                      <select
                        id="contact-service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
                      >
                        {SERVICES.map((item) => (
                          <option key={item.number} value={item.title}>
                            {item.number}. {item.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-timeline"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Target Timeline
                      </label>
                      <select
                        id="contact-timeline"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
                      >
                        <option value="Within 24 hours">Within 24 hours</option>
                        <option value="This week">This week</option>
                        <option value="Ongoing weekly support">Ongoing weekly support</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-slate-800"
                    >
                      Project Details &amp; Volume
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe the files, record count, formatting requirements, or administrative tasks..."
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-medium text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-blue-800 disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>{isSubmitting ? "Submitting..." : "Send Project Inquiry"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
