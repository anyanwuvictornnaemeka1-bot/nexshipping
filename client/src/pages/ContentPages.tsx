import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Warehouse,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageIntro, SectionEyebrow } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const PORT_IMAGE = "/manus-storage/port_b4df33f8.jpg";
const WAREHOUSE_IMAGE = "/manus-storage/warehouse_213ef315.jpg";
const AIR_IMAGE = "/manus-storage/air-cargo_249d10c5.jpg";

export function ServicesPage() {
  const services = [
    {
      title: "Ocean freight",
      text: "Move full containers, partial loads, and project cargo with capacity you can count on.",
      image: PORT_IMAGE,
      icon: Globe2,
      bullets: [
        "FCL and LCL consolidation",
        "Port-to-door visibility",
        "Project and breakbulk expertise",
      ],
    },
    {
      title: "Air freight",
      text: "Meet tight timelines with a responsive air network designed for urgent and high-value shipments.",
      image: AIR_IMAGE,
      icon: ArrowUpRight,
      bullets: [
        "Priority and express service",
        "Charter coordination",
        "Temperature-sensitive handling",
      ],
    },
    {
      title: "Ground transport",
      text: "Connect every first and final mile with a dependable fleet and local knowledge.",
      image: WAREHOUSE_IMAGE,
      icon: Warehouse,
      bullets: [
        "FTL, LTL, and drayage",
        "Cross-border road freight",
        "Appointment and delivery management",
      ],
    },
  ];
  return (
    <main>
      <PageIntro
        eyebrow="Our services"
        title="The right move, at every stage."
        description="From port to doorstep, we bring the people, technology, and partnerships to make your logistics work harder."
      />
      <section className="container grid gap-6 py-20 lg:py-28">
        {services.map((service, index) => (
          <article
            key={service.title}
            className="grid overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_rgba(17,38,61,0.06)] md:grid-cols-2"
          >
            <img
              src={service.image}
              alt={service.title}
              className={`h-full min-h-[270px] w-full object-cover ${index % 2 ? "md:order-2" : ""}`}
            />
            <div className="p-8 sm:p-12">
              <service.icon className="size-7 text-[#f35b24]" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#8c9aa8]">
                0{index + 1} · End-to-end service
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                {service.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-[#617083]">
                {service.text}
              </p>
              <div className="mt-7 grid gap-3 border-t border-[#e1e7ed] pt-6">
                {service.bullets.map(bullet => (
                  <div
                    key={bullet}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-[#d7eee8] text-[#13715a]">
                      <Check className="size-3.5" />
                    </span>
                    {bullet}
                  </div>
                ))}
              </div>
              <Link
                href="/quote"
                className="mt-8 inline-flex items-center gap-2 font-semibold text-[#f35b24]"
              >
                Talk to our team <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section className="bg-[#eaf0f3] py-20">
        <div className="container grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-7">
            <p className="font-display text-4xl font-semibold">
              140<span className="text-[#f35b24]">+</span>
            </p>
            <p className="mt-2 text-sm text-[#617083]">
              countries in our partner network
            </p>
          </div>
          <div className="rounded-2xl bg-white p-7">
            <p className="font-display text-4xl font-semibold">
              24<span className="text-[#f35b24]">/7</span>
            </p>
            <p className="mt-2 text-sm text-[#617083]">
              operations and customer support
            </p>
          </div>
          <div className="rounded-2xl bg-white p-7">
            <p className="font-display text-4xl font-semibold">
              99.2<span className="text-[#f35b24]">%</span>
            </p>
            <p className="mt-2 text-sm text-[#617083]">
              on-time delivery performance
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AboutPage() {
  return (
    <main>
      <PageIntro
        eyebrow="About Nexshipping"
        title="The human side of global movement."
        description="We believe logistics is more than moving things from A to B. It’s about making progress possible for people, products, and the places they reach."
      />
      <section className="container grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <SectionEyebrow>Our point of view</SectionEyebrow>
          <h2 className="mt-5 max-w-xl font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
            Complex is a given. Confusion isn’t.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-[#617083]">
            Nexshipping was built by logistics people who saw a better way:
            combine the rigor of a global forwarder with the clarity of a modern
            operating system. We stay close to the cargo, the data, and the
            humans behind every move.
          </p>
          <p className="mt-5 max-w-lg text-base leading-8 text-[#617083]">
            Today, our teams in Chicago, Rotterdam, Singapore, and Dubai
            coordinate an always-on network that helps businesses grow with
            confidence.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={WAREHOUSE_IMAGE}
            alt="Nexshipping warehouse operations"
            className="h-[440px] w-full object-cover"
          />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-[#071b2f]/90 p-5 text-white backdrop-blur">
            <p className="font-display text-2xl font-semibold">
              25 years in motion
            </p>
            <p className="mt-1 text-sm text-white/55">
              Still curious. Still moving forward.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-[#071b2f] py-24 text-white">
        <div className="container grid gap-12 md:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff8358]">
              01
            </p>
            <h3 className="mt-5 font-display text-2xl font-semibold">
              Own the outcome
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/55">
              We take responsibility for the full journey, not just the handoff.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff8358]">
              02
            </p>
            <h3 className="mt-5 font-display text-2xl font-semibold">
              Make it clear
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/55">
              Good communication is an operational advantage. We make the next
              step obvious.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff8358]">
              03
            </p>
            <h3 className="mt-5 font-display text-2xl font-semibold">
              Keep moving
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/55">
              We build resilience into every lane, so progress doesn’t stop at
              the first surprise.
            </p>
          </div>
        </div>
      </section>
      <section className="container py-20 text-center">
        <SectionEyebrow>Ready when you are</SectionEyebrow>
        <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-semibold tracking-[-0.055em]">
          Let’s make your next move a better one.
        </h2>
        <Button
          asChild
          className="mt-8 rounded-full bg-[#f35b24] text-white hover:bg-[#df4d1a]"
        >
          <Link href="/quote">
            Start a conversation <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </section>
    </main>
  );
}

export function NewsPage() {
  const content = trpc.publicContent.home.useQuery();
  return (
    <main>
      <PageIntro
        eyebrow="Insights"
        title="Ideas for the way the world moves."
        description="Practical perspectives from our network on freight, resilience, visibility, and the future of supply chains."
      />
      <section className="container py-20 lg:py-28">
        <div className="grid gap-6 md:grid-cols-3">
          {(content.data?.posts ?? []).map((post, index) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_35px_rgba(17,38,61,0.06)]"
            >
              <div className="h-52 bg-[#dfe8ec]">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <img
                    src={[WAREHOUSE_IMAGE, AIR_IMAGE, PORT_IMAGE][index % 3]}
                    alt=""
                    className="size-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f35b24]">
                  {post.category}
                </p>
                <h2 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.04em]">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#617083]">
                  {post.excerpt}
                </p>
                <Link
                  href={`/news/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                >
                  Read story <ArrowRight className="size-4 text-[#f35b24]" />
                </Link>
              </div>
            </article>
          ))}
          {!content.isLoading && (content.data?.posts ?? []).length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-[#cbd5dd] p-12 text-center">
              <p className="font-display text-2xl font-semibold">
                New insights are on the way.
              </p>
              <p className="mt-2 text-sm text-[#617083]">
                Check back soon for perspectives from our network.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export function FAQPage() {
  const [open, setOpen] = useState(0);
  const faqs = [
    [
      "How do I track my shipment?",
      "Use the tracking number provided by your Nexshipping contact on our tracking page. You’ll see the latest verified milestone, current location, and estimated delivery.",
    ],
    [
      "What countries do you ship to?",
      "Our partner network reaches 140+ countries across ocean, air, ground, rail, and multimodal services. Tell us your lane and we’ll confirm the best options.",
    ],
    [
      "How quickly can I get a quote?",
      "Share your shipment details through our quote form and a specialist will follow up within one business day with a tailored route and price.",
    ],
    [
      "Can you handle special cargo?",
      "Yes. We support temperature-sensitive, high-value, project, and oversized cargo with the right handling partners and service levels.",
    ],
    [
      "What happens if there is a delay?",
      "Our operations team monitors the route and communicates proactively. If an exception occurs, we’ll share the impact and the next best move.",
    ],
  ];
  return (
    <main>
      <PageIntro
        eyebrow="Frequently asked questions"
        title="Clear answers, before you ask."
        description="A few of the things our customers ask most. If you don’t see what you need, we’re one message away."
      />
      <section className="container grid gap-12 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:py-28">
        <div>
          <SectionEyebrow>Need a hand?</SectionEyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">
            No question is too specific.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#617083]">
            Our specialists can help with a lane, a deadline, a special handling
            requirement, or just a second opinion.
          </p>
          <Button
            asChild
            className="mt-7 rounded-full bg-[#071b2f] text-white hover:bg-[#16344f]"
          >
            <Link href="/contact">
              Talk to our team <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-3">
          {faqs.map(([question, answer], index) => (
            <div
              key={question}
              className="rounded-2xl border border-[#e1e7ed] bg-white"
            >
              <button
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                {question}
                <ChevronDown
                  className={`size-5 shrink-0 text-[#f35b24] transition-transform ${open === index ? "rotate-180" : ""}`}
                />
              </button>
              {open === index && (
                <p className="px-5 pb-5 text-sm leading-7 text-[#617083]">
                  {answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ContactPage() {
  const contact = trpc.contact.create.useMutation({
    onSuccess: () => {
      toast.success("Message received. We’ll be in touch soon.");
    },
    onError: error => toast.error(error.message),
  });
  return (
    <main>
      <PageIntro
        eyebrow="Contact us"
        title="Let’s get your cargo moving."
        description="Tell us what you’re working on. Our team is here to help with a route, a quote, or a clear next step."
      />
      <section className="container grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:py-28">
        <div>
          <div className="grid gap-6">
            <div className="flex gap-4">
              <span className="grid size-11 place-items-center rounded-xl bg-[#fff0e9] text-[#f35b24]">
                <Mail className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8c9aa8]">
                  Email
                </p>
                <p className="mt-1 font-semibold">hello@nexshipping.com</p>
                <p className="mt-1 text-sm text-[#617083]">
                  Replies within one business day
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="grid size-11 place-items-center rounded-xl bg-[#fff0e9] text-[#f35b24]">
                <Phone className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8c9aa8]">
                  Phone
                </p>
                <p className="mt-1 font-semibold">+1 (312) 555-0148</p>
                <p className="mt-1 text-sm text-[#617083]">
                  Global support, 24 / 7
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="grid size-11 place-items-center rounded-xl bg-[#fff0e9] text-[#f35b24]">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8c9aa8]">
                  Headquarters
                </p>
                <p className="mt-1 font-semibold">Chicago, Illinois</p>
                <p className="mt-1 text-sm text-[#617083]">
                  With teams in Rotterdam, Singapore, and Dubai
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 rounded-2xl bg-[#071b2f] p-7 text-white">
            <Clock3 className="size-6 text-[#ff8358]" />
            <p className="mt-5 font-display text-xl font-semibold">
              Good to know
            </p>
            <p className="mt-2 text-sm leading-6 text-white/50">
              For urgent shipment support, call us directly. For a pricing
              conversation, use our quote form so we can gather the right
              details.
            </p>
          </div>
        </div>
        <form
          onSubmit={event => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            contact.mutate(Object.fromEntries(form) as never);
          }}
          className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(17,38,61,0.07)] sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Name *</label>
              <input
                required
                name="name"
                className="mt-2 h-12 w-full rounded-xl border border-[#dfe5eb] px-4 text-sm outline-none focus:border-[#f35b24]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Email *</label>
              <input
                required
                type="email"
                name="email"
                className="mt-2 h-12 w-full rounded-xl border border-[#dfe5eb] px-4 text-sm outline-none focus:border-[#f35b24]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Phone</label>
              <input
                name="phone"
                className="mt-2 h-12 w-full rounded-xl border border-[#dfe5eb] px-4 text-sm outline-none focus:border-[#f35b24]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Subject</label>
              <input
                name="subject"
                className="mt-2 h-12 w-full rounded-xl border border-[#dfe5eb] px-4 text-sm outline-none focus:border-[#f35b24]"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="text-sm font-semibold">How can we help? *</label>
            <textarea
              required
              name="message"
              rows={7}
              className="mt-2 w-full rounded-xl border border-[#dfe5eb] px-4 py-3 text-sm outline-none focus:border-[#f35b24]"
            />
          </div>
          <Button
            disabled={contact.isPending}
            type="submit"
            className="mt-8 h-12 rounded-full bg-[#f35b24] px-6 text-white hover:bg-[#df4d1a]"
          >
            {contact.isPending ? "Sending…" : "Send message"}{" "}
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </section>
    </main>
  );
}

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy";
  return (
    <main>
      <PageIntro
        eyebrow={privacy ? "Privacy policy" : "Terms & conditions"}
        title={
          privacy
            ? "Your information, handled with care."
            : "The fine print, made plain."
        }
        description={
          privacy
            ? "This overview explains how Nexshipping collects, uses, and protects information when you use our website and services."
            : "These terms outline the expectations and responsibilities that come with using Nexshipping services."
        }
      />
      <section className="container max-w-3xl py-20 lg:py-28">
        <div className="prose prose-slate max-w-none">
          <h2>Overview</h2>
          <p>
            {privacy
              ? "We collect only the information we need to respond to requests, manage shipments, improve our services, and maintain a secure experience. We do not sell personal information."
              : "By using this website or requesting services, you agree to provide accurate information and to use our services for lawful business purposes."}
          </p>
          <h2>Information we collect</h2>
          <p>
            Information may include contact details, shipment details, company
            information, and usage data needed to deliver a useful and secure
            experience.
          </p>
          <h2>How we use information</h2>
          <p>
            We use information to provide quotes, communicate about requests,
            operate shipments, improve our network, and meet legal or security
            obligations. Access is limited to people and partners who need it to
            perform their role.
          </p>
          <h2>Questions</h2>
          <p>
            If you have questions about this {privacy ? "policy" : "agreement"},
            contact{" "}
            <a href="mailto:hello@nexshipping.com">hello@nexshipping.com</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
