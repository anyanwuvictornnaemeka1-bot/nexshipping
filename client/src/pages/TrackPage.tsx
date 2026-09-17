import {
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";

const statusLabels: Record<string, string> = {
  booked: "Booked",
  in_transit: "In transit",
  customs: "Customs clearance",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  exception: "Exception",
};

export default function TrackPage() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [validationError, setValidationError] = useState("");
  const lookup = trpc.tracking.lookup.useQuery(
    { trackingNumber: submitted },
    { enabled: Boolean(submitted), retry: false }
  );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = input.trim().toUpperCase();
    if (normalized.length < 4 || normalized.length > 32) {
      setValidationError("Enter a tracking number between 4 and 32 characters.");
      setSubmitted("");
      return;
    }
    setValidationError("");
    setSubmitted(normalized);
  };
  return (
    <main>
      <PageIntro
        eyebrow="Shipment visibility"
        title="Know exactly where your cargo stands."
        description="Enter your Nexshipping tracking number for the latest verified milestone, current location, and estimated delivery."
      />
      <section className="container -mt-8 pb-24">
        <form
          onSubmit={submit}
          className="relative z-10 mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-[#e1e7ed] bg-white p-3 shadow-[0_20px_60px_rgba(17,38,61,0.12)] sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-[#f6f7f9] px-4">
            <Search className="size-5 text-[#8c9aa8]" />
            <input
              aria-label="Tracking number"
              aria-invalid={Boolean(validationError)}
              aria-describedby={validationError ? "tracking-error" : undefined}
              required
              minLength={4}
              maxLength={32}
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Enter tracking number (e.g. NX-2048-AC)"
              className="h-12 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <Button
            type="submit"
            className="h-12 rounded-xl bg-[#f35b24] px-6 font-semibold text-white hover:bg-[#df4d1a]"
          >
            Track shipment <ArrowRight className="size-4" />
          </Button>
        </form>
        {validationError && (
          <p id="tracking-error" role="alert" className="mx-auto mt-3 max-w-3xl text-sm font-medium text-[#c94714]">
            {validationError}
          </p>
        )}
        {lookup.isFetching && (
          <div className="mx-auto mt-12 max-w-3xl animate-pulse rounded-2xl bg-white p-8">
            <div className="h-5 w-40 rounded bg-[#eaf0f3]" />
            <div className="mt-5 h-10 w-2/3 rounded bg-[#eaf0f3]" />
            <div className="mt-8 h-24 rounded bg-[#eaf0f3]" />
          </div>
        )}
        {lookup.isError && (
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#f2c9bd] bg-[#fff7f4] p-8 text-center">
            <p className="font-display text-2xl font-semibold">
              We couldn’t load that tracking number.
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6d7784]">
              Please check the number and try again. If you still need help, our
              team is ready.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-[#f35b24]"
            >
              Contact support <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
        {submitted && !lookup.isFetching && lookup.data === null && (
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#e1e7ed] bg-white p-10 text-center">
            <Package className="mx-auto size-9 text-[#f35b24]" />
            <p className="mt-5 font-display text-2xl font-semibold">
              No shipment found
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6d7784]">
              We don’t have a shipment matching{" "}
              <span className="font-semibold text-[#122235]">{submitted}</span>.
              Check the reference or ask your Nexshipping contact.
            </p>
          </div>
        )}
        {lookup.data && (
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-2xl bg-[#071b2f] p-7 text-white sm:p-9">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                      Tracking number
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">
                      {lookup.data!.shipment.trackingNumber}
                    </h2>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#d7eee8] px-3 py-1.5 text-xs font-bold text-[#13715a]">
                    <span className="size-1.5 rounded-full bg-[#13715a]" />
                    {statusLabels[lookup.data!.shipment.status] ??
                      lookup.data!.shipment.status}
                  </span>
                </div>
                <div className="mt-10 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/40">
                      Current location
                    </p>
                    <p className="mt-2 font-semibold">
                      {lookup.data!.shipment.currentLocation ?? "In network"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/40">
                      Destination
                    </p>
                    <p className="mt-2 font-semibold">
                      {lookup.data!.shipment.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/40">
                      Est. delivery
                    </p>
                    <p className="mt-2 font-semibold">
                      {lookup.data!.shipment.estimatedDelivery
                        ? new Date(
                            lookup.data!.shipment.estimatedDelivery
                          ).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "To be confirmed"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[#e1e7ed] bg-white p-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c9aa8]">
                  Route
                </p>
                <div className="mt-7 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-[#eaf0f3] text-[#122235]">
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs text-[#8c9aa8]">Origin</p>
                    <p className="font-semibold">
                      {lookup.data!.shipment.origin}
                    </p>
                  </div>
                </div>
                <div className="ml-4 h-10 border-l border-dashed border-[#cbd5dd]" />
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-[#fff0e9] text-[#f35b24]">
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs text-[#8c9aa8]">Destination</p>
                    <p className="font-semibold">
                      {lookup.data!.shipment.destination}
                    </p>
                  </div>
                </div>
                <div className="mt-7 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-[#f6f7f9] p-3">
                    <p className="text-xs text-[#8c9aa8]">Mode</p>
                    <p className="mt-1 font-semibold capitalize">
                      {lookup.data!.shipment.shipmentType}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#f6f7f9] p-3">
                    <p className="text-xs text-[#8c9aa8]">Service</p>
                    <p className="mt-1 font-semibold">
                      {lookup.data!.shipment.serviceLevel ?? "Standard"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#e1e7ed] bg-white p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c9aa8]">
                    Shipment history
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">
                    Every handoff, accounted for.
                  </h3>
                </div>
                <Clock3 className="size-6 text-[#f35b24]" />
              </div>
              <div className="mt-8 grid gap-0">
                {lookup.data!.events.length === 0 && (
                  <p className="text-sm text-[#6d7784]">
                    No event history has been recorded yet.
                  </p>
                )}
                {lookup.data!.events.map((event, index) => (
                  <div
                    key={event.id}
                    className="relative flex gap-4 pb-7 last:pb-0"
                  >
                    <div className="relative flex flex-col items-center">
                      <span
                        className={
                          index === 0
                            ? "z-10 grid size-8 place-items-center rounded-full bg-[#f35b24] text-white"
                            : "z-10 grid size-8 place-items-center rounded-full border border-[#d6e0e6] bg-white text-[#8694a1]"
                        }
                      >
                        {index === 0 ? (
                          <Truck className="size-4" />
                        ) : (
                          <Check className="size-4" />
                        )}
                      </span>
                      {index < lookup.data!.events.length - 1 && (
                        <span className="absolute top-8 h-full w-px bg-[#dfe5eb]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold">{event.title}</p>
                        <span className="text-xs text-[#8c9aa8]">
                          {new Date(event.eventTime).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[#6d7784]">
                        {event.description ?? event.status}
                        {event.location ? ` · ${event.location}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#eaf0f3] p-6">
            <ShieldCheck className="size-5 text-[#13715a]" />
            <p className="mt-4 font-semibold">Verified updates</p>
            <p className="mt-2 text-sm leading-6 text-[#6d7784]">
              Data comes from our operations network, not estimates.
            </p>
          </div>
          <div className="rounded-2xl bg-[#eaf0f3] p-6">
            <MapPin className="size-5 text-[#f35b24]" />
            <p className="mt-4 font-semibold">Global coverage</p>
            <p className="mt-2 text-sm leading-6 text-[#6d7784]">
              Local expertise at every major handoff.
            </p>
          </div>
          <div className="rounded-2xl bg-[#eaf0f3] p-6">
            <Clock3 className="size-5 text-[#122235]" />
            <p className="mt-4 font-semibold">Always on</p>
            <p className="mt-2 text-sm leading-6 text-[#6d7784]">
              Our support team is here around the clock.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
