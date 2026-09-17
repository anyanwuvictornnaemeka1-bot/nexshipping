import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Globe2,
  Headphones,
  Package,
  Plane,
  Quote,
  Ship,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const PORT_IMAGE = "/manus-storage/nexshipping-port_2f7bcd6c.jpg";
const WAREHOUSE_IMAGE = "/manus-storage/nexshipping-warehouse_6a828de0.jpg";
const AIR_IMAGE = "/manus-storage/nexshipping-air-cargo_0476670c.jpg";

const serviceCards = [
  {
    icon: Ship,
    title: "Ocean freight",
    text: "Port-to-port and door-to-door ocean solutions with predictable capacity.",
    meta: "FCL · LCL · Breakbulk",
    image: PORT_IMAGE,
  },
  {
    icon: Plane,
    title: "Air freight",
    text: "Critical cargo moved with precision, speed, and proactive exception handling.",
    meta: "Express · Charter · Consolidated",
    image: AIR_IMAGE,
  },
  {
    icon: Truck,
    title: "Ground transport",
    text: "Reliable first and last-mile delivery across the network that keeps business moving.",
    meta: "FTL · LTL · Drayage",
    image: WAREHOUSE_IMAGE,
  },
];

const partners = ["NORTHSTAR", "ALTITUDE", "MERCURY", "VANTAGE", "KINETIC"];

export default function Home() {
  const [email, setEmail] = useState("");
  const newsletter = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setEmail("");
      toast.success("You’re on the list.");
    },
    onError: error => toast.error(error.message),
  });

  return (
    <main>
      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#071b2f] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,27,47,0.98)_0%,rgba(7,27,47,0.84)_44%,rgba(7,27,47,0.2)_100%)]" />
        <img
          src={PORT_IMAGE}
          alt="Cargo containers at a global port"
          className="absolute inset-0 -z-10 size-full object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(243,91,36,0.2),transparent_32%)]" />
        <div className="container relative flex min-h-[680px] items-center py-24">
          <div className="max-w-3xl animate-rise">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
              <span className="size-2 rounded-full bg-[#f35b24] shadow-[0_0_12px_#f35b24]" />{" "}
              Built for the next move
            </div>
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-[88px]">
              Fast, reliable &amp; secure{" "}
              <span className="text-[#ff8358]">global shipping.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
              Delivering cargo safely and on time across the world. Nexshipping
              connects your freight to a smarter, more resilient global network.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-13 rounded-full bg-[#f35b24] px-6 text-base font-semibold text-white shadow-[0_14px_28px_rgba(243,91,36,0.25)] hover:bg-[#df4d1a]"
              >
                <Link href="/tracking">
                  Track a shipment <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-13 rounded-full border-white/25 bg-white/8 px-6 text-base font-semibold text-white hover:bg-white/15"
              >
                <Link href="/quote">
                  Request a quote <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="container absolute bottom-0 left-1/2 grid -translate-x-1/2 translate-y-1/2 grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white text-[#122235] shadow-[0_20px_60px_rgba(7,27,47,0.24)] sm:grid-cols-4">
          {[
            ["99.2", "%", "On-time delivery"],
            ["140", "+", "Countries reached"],
            ["24", "/7", "Global support"],
            ["25", "+", "Years in motion"],
          ].map(([number, suffix, label], index) => (
            <div
              key={label}
              className={`p-5 ${index < 2 ? "border-b sm:border-b-0" : ""} ${index % 2 === 0 ? "border-r" : ""} sm:border-[#dfe5eb]`}
            >
              <p className="font-display text-3xl font-semibold">
                {number}
                <span className="text-[#f35b24]">{suffix}</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.13em] text-[#708092]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container grid gap-12 py-32 md:grid-cols-[0.85fr_1.15fr] md:items-end lg:py-40">
        <div>
          <SectionEyebrow>Who we are</SectionEyebrow>
          <h2 className="mt-5 max-w-md font-display text-4xl font-semibold leading-tight tracking-[-0.055em] sm:text-5xl">
            The logistics partner behind your next chapter.
          </h2>
        </div>
        <div>
          <p className="max-w-xl text-lg leading-8 text-[#536477]">
            From a single pallet to an entire supply chain, we make complex
            shipping feel simple. Our people, platform, and partner network work
            as one to keep you ahead of every handoff.
          </p>
          <Link
            href="/about"
            className="mt-7 inline-flex items-center gap-2 font-semibold text-[#f35b24] transition-colors hover:text-[#c94714]"
          >
            Get to know Nexshipping <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionEyebrow>What we move</SectionEyebrow>
              <h2 className="mt-5 max-w-lg font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                One network. Every mode.
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-semibold text-[#122235] hover:text-[#f35b24]"
            >
              Explore all services <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {serviceCards.map((service, index) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="group overflow-hidden rounded-2xl border border-[#e1e7ed] bg-[#f6f7f9] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(17,38,61,0.11)]"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,27,47,0.5))]" />
                    <span className="absolute left-5 top-5 grid size-11 place-items-center rounded-xl bg-white/90 text-[#f35b24] backdrop-blur">
                      <Icon className="size-5" />
                    </span>
                    <span className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-[0.13em] text-white/85">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.04em]">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#617083]">
                      {service.text}
                    </p>
                    <p className="mt-5 border-t border-[#dfe5eb] pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#f35b24]">
                      {service.meta}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#eaf0f3] py-24 lg:py-32">
        <div className="absolute right-[-8%] top-[-10%] size-[480px] rounded-full border border-[#cbd8e1]" />
        <div className="absolute right-[5%] top-[5%] size-[300px] rounded-full border border-[#cbd8e1]" />
        <div className="container relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionEyebrow>Built for visibility</SectionEyebrow>
            <h2 className="mt-5 max-w-lg font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              A clearer view of everything in motion.
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-[#617083]">
              Know where your cargo is, what’s happening next, and who’s already
              on it. Every Nexshipping move comes with context.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                "One source of truth for every shipment",
                "Proactive alerts before exceptions become issues",
                "Human support whenever you need a second set of eyes",
              ].map(item => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm font-medium text-[#263b50]"
                >
                  <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-[#d7eee8] text-[#13715a]">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <Button
              asChild
              className="mt-9 h-12 rounded-full bg-[#071b2f] px-5 text-white hover:bg-[#16344f]"
            >
              <Link href="/tracking">
                See tracking in action <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="relative min-h-[380px] overflow-hidden rounded-[28px] bg-[#071b2f] p-5 shadow-[0_24px_60px_rgba(7,27,47,0.18)] sm:p-8">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_50%_50%,rgba(243,91,36,0.18),transparent_65%)]" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Live network view
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-white">
                  2,481 shipments moving
                </p>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-[#ff8358]">
                <Globe2 className="size-5" />
              </span>
            </div>
            <div className="relative mt-8 h-48 rounded-2xl border border-white/10 bg-[#0d2a46]">
              <svg
                viewBox="0 0 600 220"
                className="absolute inset-0 size-full overflow-visible"
              >
                <path
                  d="M88 128 C170 55 210 168 287 102 S414 60 500 122"
                  fill="none"
                  stroke="#f35b24"
                  strokeWidth="2"
                  strokeDasharray="7 8"
                />
                <circle
                  cx="88"
                  cy="128"
                  r="7"
                  fill="#f35b24"
                  stroke="#fff"
                  strokeWidth="3"
                />
                <circle
                  cx="287"
                  cy="102"
                  r="7"
                  fill="#f35b24"
                  stroke="#fff"
                  strokeWidth="3"
                />
                <circle
                  cx="500"
                  cy="122"
                  r="7"
                  fill="#f35b24"
                  stroke="#fff"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.14em] text-white/45">
                Chicago
              </div>
              <div className="absolute left-[45%] top-5 text-[10px] uppercase tracking-[0.14em] text-white/45">
                Rotterdam
              </div>
              <div className="absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.14em] text-white/45">
                Singapore
              </div>
            </div>
            <div className="relative mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                ["1,908", "Ocean"],
                ["389", "Air"],
                ["184", "Ground"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <p className="font-display text-xl font-semibold text-white">
                    {number}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/40">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[26px] bg-[#d7e3e8] p-8 sm:p-12">
            <div className="absolute right-[-20%] top-[-20%] size-72 rounded-full bg-[#f35b24]/10 blur-3xl" />
            <div className="relative">
              <Quote className="size-10 text-[#f35b24]" fill="currentColor" />
              <p className="mt-7 max-w-lg font-display text-3xl font-medium leading-tight tracking-[-0.04em] text-[#122235] sm:text-4xl">
                “Nexshipping gave us the confidence to scale into three new
                markets without adding a layer of complexity.”
              </p>
              <div className="mt-9 flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-[#071b2f] text-sm font-bold text-white">
                  AM
                </div>
                <div>
                  <p className="text-sm font-semibold">Avery Morgan</p>
                  <p className="text-xs text-[#617083]">
                    VP Operations, Northstar Goods
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <SectionEyebrow>Why Nexshipping</SectionEyebrow>
            <h2 className="mt-5 max-w-md font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              The difference is in the details.
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                [
                  Zap,
                  "Faster decisions",
                  "A single team with the visibility to act before delays land.",
                ],
                [
                  Headphones,
                  "Real human support",
                  "A logistics specialist who knows your business, not just your tracking number.",
                ],
                [
                  Package,
                  "Flexible by design",
                  "Solutions that flex with the season, the shipment, and the next big opportunity.",
                ],
                [
                  Sparkles,
                  "Calm in the complex",
                  "Clear communication when the route gets complicated.",
                ],
              ].map(([Icon, title, text]) => {
                const I = Icon as typeof Zap;
                return (
                  <div
                    key={title as string}
                    className="rounded-2xl border border-[#e1e7ed] bg-white p-5"
                  >
                    <I className="size-5 text-[#f35b24]" />
                    <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.03em]">
                      {title as string}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#617083]">
                      {text as string}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <p className="text-center text-xs font-bold uppercase tracking-[0.23em] text-[#94a1ae]">
            Trusted by teams who keep the world moving
          </p>
          <div className="mt-10 grid grid-cols-2 items-center gap-8 text-center font-display text-lg font-bold tracking-[0.12em] text-[#b2bdc7] sm:grid-cols-5">
            {partners.map(partner => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-24 lg:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionEyebrow>From the network</SectionEyebrow>
            <h2 className="mt-5 max-w-xl font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              What we’re thinking about.
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 font-semibold text-[#122235] hover:text-[#f35b24]"
          >
            Read all insights <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            [
              WAREHOUSE_IMAGE,
              "Operations · 6 min read",
              "How to build a supply chain that bends, not breaks.",
            ],
            [
              AIR_IMAGE,
              "Air freight · 4 min read",
              "The new rules of speed in global commerce.",
            ],
            [
              PORT_IMAGE,
              "Perspective · 8 min read",
              "Why visibility is the next competitive advantage.",
            ],
          ].map(([image, meta, title]) => (
            <article
              key={title}
              className="group overflow-hidden rounded-2xl bg-[#eaf0f3]"
            >
              <img
                src={image}
                alt=""
                className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f35b24]">
                  {meta}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.04em]">
                  {title}
                </h3>
                <Link
                  href="/news"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                >
                  Read story <ChevronRight className="size-4 text-[#f35b24]" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-24 lg:pb-32">
        <div className="relative overflow-hidden rounded-[28px] bg-[#f35b24] px-7 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16 lg:py-14">
          <div className="absolute right-[-4%] top-[-60%] size-96 rounded-full border-[35px] border-white/10" />
          <div className="relative">
            <SectionEyebrow light>Stay in motion</SectionEyebrow>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              Better logistics starts with a better conversation.
            </h2>
          </div>
          <div className="relative mt-8 w-full max-w-md lg:mt-0">
            <p className="mb-4 text-sm text-white/75">
              Monthly insights on freight, resilience, and the future of
              movement.
            </p>
            <form
              onSubmit={event => {
                event.preventDefault();
                if (email) newsletter.mutate({ email });
              }}
              className="flex gap-2 rounded-full bg-white p-1.5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="Your work email"
                className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-4 text-sm text-[#122235] outline-none placeholder:text-[#8b98a5]"
              />
              <button
                disabled={newsletter.isPending}
                className="shrink-0 rounded-full bg-[#071b2f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16344f]"
              >
                {newsletter.isPending ? "Joining…" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
