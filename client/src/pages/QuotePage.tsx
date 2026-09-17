import {
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 text-sm text-[#122235] outline-none transition-shadow focus:border-[#f35b24] focus:ring-4 focus:ring-[#f35b24]/10";
const labelClass = "text-sm font-semibold text-[#263b50]";

export default function QuotePage() {
  const [sent, setSent] = useState(false);
  const quote = trpc.quote.create.useMutation({
    onSuccess: () => setSent(true),
    onError: error => toast.error(error.message),
  });
  if (sent)
    return (
      <main>
        <PageIntro
          eyebrow="Quote request"
          title="We’re already working on it."
          description="Thanks for giving us the details. A Nexshipping specialist will follow up with a tailored route and pricing plan within one business day."
        />
        <section className="container py-24">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-[0_20px_60px_rgba(17,38,61,0.08)] sm:p-16">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#d7eee8] text-[#13715a]">
              <Check className="size-8" />
            </span>
            <h2 className="mt-7 font-display text-3xl font-semibold tracking-[-0.04em]">
              Quote request received
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6d7784]">
              We’ll review your shipment details and get back to you with the
              best options for your lane.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                className="rounded-full bg-[#071b2f] text-white hover:bg-[#16344f]"
              >
                <Link href="/">Back to home</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/tracking">Track a shipment</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  return (
    <main>
      <PageIntro
        eyebrow="Request a quote"
        title="Tell us what needs to move."
        description="Share a few details and we’ll shape a smarter route, service level, and price for your cargo."
      />
      <section className="container grid gap-10 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
        <form
          onSubmit={event => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            quote.mutate(Object.fromEntries(form) as never);
          }}
          className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(17,38,61,0.07)] sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="quote-full-name" className={labelClass}>Full name *</label>
              <input required id="quote-full-name" name="fullName" autoComplete="name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="quote-email" className={labelClass}>Work email *</label>
              <input
                required
                type="email"
                id="quote-email"
                name="email"
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="quote-phone" className={labelClass}>Phone</label>
              <input id="quote-phone" name="phone" autoComplete="tel" className={inputClass} />
            </div>
            <div>
              <label htmlFor="quote-company" className={labelClass}>Company</label>
              <input id="quote-company" name="company" autoComplete="organization" className={inputClass} />
            </div>
            <div>
              <label htmlFor="quote-origin" className={labelClass}>Origin *</label>
              <input
                required
                name="origin"
                id="quote-origin"
                placeholder="City, country"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="quote-destination" className={labelClass}>Destination *</label>
              <input
                required
                name="destination"
                id="quote-destination"
                placeholder="City, country"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="quote-shipment-type" className={labelClass}>Shipment type *</label>
              <div className="relative">
                <select
                  required
                  name="shipmentType"
                  id="quote-shipment-type"
                  className={inputClass + " appearance-none pr-10"}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a mode
                  </option>
                  <option value="Ocean freight">Ocean freight</option>
                  <option value="Air freight">Air freight</option>
                  <option value="Ground transport">Ground transport</option>
                  <option value="Multimodal">Multimodal</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-6 size-4 text-[#8c9aa8]" />
              </div>
            </div>
            <div>
              <label htmlFor="quote-shipping-method" className={labelClass}>Preferred shipping method</label>
              <input
                name="shippingMethod"
                id="quote-shipping-method"
                placeholder="Express, standard, etc."
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="quote-weight" className={labelClass}>Weight</label>
              <input
                name="weight"
                id="quote-weight"
                placeholder="e.g. 1,200 kg"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="quote-dimensions" className={labelClass}>Dimensions</label>
              <input
                name="dimensions"
                id="quote-dimensions"
                placeholder="L × W × H"
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="quote-cargo-description" className={labelClass}>Cargo description *</label>
            <textarea
              required
              name="cargoDescription"
              id="quote-cargo-description"
              rows={4}
              placeholder="What are you shipping? Include any special handling requirements."
              className="mt-2 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 py-3 text-sm outline-none transition-shadow focus:border-[#f35b24] focus:ring-4 focus:ring-[#f35b24]/10"
            />
          </div>
          <div className="mt-6">
            <label htmlFor="quote-notes" className={labelClass}>Additional notes</label>
            <textarea
              name="notes"
              id="quote-notes"
              rows={3}
              placeholder="Anything else we should know?"
              className="mt-2 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 py-3 text-sm outline-none transition-shadow focus:border-[#f35b24] focus:ring-4 focus:ring-[#f35b24]/10"
            />
          </div>
          <Button
            disabled={quote.isPending}
            type="submit"
            className="mt-8 h-13 rounded-full bg-[#f35b24] px-6 font-semibold text-white hover:bg-[#df4d1a]"
          >
            {quote.isPending ? "Sending request…" : "Request my quote"}{" "}
            <ArrowRight className="size-4" />
          </Button>
          {quote.isError && <p role="alert" className="mt-4 text-sm font-medium text-[#c94714]">We couldn’t submit your quote request. Please try again or contact our team.</p>}
        </form>
        <aside className="lg:pl-6">
          <div className="rounded-3xl bg-[#071b2f] p-8 text-white sm:p-10">
            <FileText className="size-7 text-[#ff8358]" />
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.04em]">
              A quote built around your reality.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/58">
              No generic rate cards. We look at your lane, timing, cargo, and
              goals to build the right combination of speed, resilience, and
              cost.
            </p>
            <div className="mt-8 grid gap-5 border-t border-white/10 pt-7">
              {[
                [Globe2, "Global reach", "140+ countries with local context."],
                [
                  ShieldCheck,
                  "Clear commitments",
                  "Transparent scope, proactive updates.",
                ],
                [
                  Check,
                  "One connected team",
                  "From first mile to final handoff.",
                ],
              ].map(([Icon, title, text]) => {
                const I = Icon as typeof Check;
                return (
                  <div key={title as string} className="flex gap-3">
                    <I className="mt-0.5 size-5 shrink-0 text-[#ff8358]" />
                    <div>
                      <p className="text-sm font-semibold">{title as string}</p>
                      <p className="mt-1 text-xs leading-5 text-white/45">
                        {text as string}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-6 text-xs leading-6 text-[#8c9aa8]">
            By submitting, you agree that Nexshipping may contact you about this
            request. We keep your information private and never sell your data.
          </p>
        </aside>
      </section>
    </main>
  );
}
