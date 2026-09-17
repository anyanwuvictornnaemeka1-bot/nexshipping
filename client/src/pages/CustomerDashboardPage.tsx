import {
  ArrowRight,
  Clock3,
  LogOut,
  Package,
  Quote,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { usePageMetadata } from "@/components/SiteLayout";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

const shipmentLabels: Record<string, string> = {
  booked: "Booked",
  in_transit: "In transit",
  customs: "Customs clearance",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  exception: "Exception",
};

const quoteLabels: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  quoted: "Quoted",
  closed: "Closed",
};

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CustomerDashboardPage() {
  usePageMetadata("/dashboard", {
    title: "Customer portal | Nexshipping",
    description: "Private Nexshipping shipment and quote dashboard.",
    noindex: true,
  });
  const auth = useAuth();
  const dashboard = trpc.customer.dashboard.useQuery(undefined, {
    enabled: auth.isAuthenticated,
    retry: false,
  });

  if (auth.loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7f9] text-[#122235]">
        <RefreshCw className="size-6 animate-spin text-[#f35b24]" />
      </main>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#071b2f] px-5 text-center text-white">
        <div className="max-w-md">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f35b24]">
            <Package className="size-7" />
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#ff8358]">Customer portal</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">Sign in to see your shipments.</h1>
          <p className="mt-4 text-sm leading-7 text-white/55">
            Your dashboard is private to your Nexshipping account. Sign in to review current shipments and quote requests.
          </p>
          <Button onClick={startLogin} className="mt-8 rounded-full bg-[#f35b24] text-white hover:bg-[#df4d1a]">
            Sign in to continue <ArrowRight className="size-4" />
          </Button>
          <Link href="/" className="mt-6 block text-sm text-white/45 hover:text-white">Back to public site</Link>
        </div>
      </main>
    );
  }

  const shipments = dashboard.data?.shipments ?? [];
  const quotes = dashboard.data?.quotes ?? [];
  const activeShipments = shipments.filter(item => item.status !== "delivered").length;

  if (dashboard.isError) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7f9] px-5 text-center text-[#122235]">
        <div className="max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f35b24]">Customer portal</p>
          <h1 className="mt-4 font-display text-3xl font-semibold">We couldn’t load your dashboard.</h1>
          <p className="mt-3 text-sm leading-7 text-[#617083]">Please try again. If the problem continues, contact Nexshipping support.</p>
          <Button onClick={() => dashboard.refetch()} className="mt-7 rounded-full bg-[#071b2f] text-white">Try again <RefreshCw className="size-4" /></Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#122235]">
      <header className="border-b border-white/10 bg-[#071b2f] text-white">
        <div className="container flex min-h-20 items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#f35b24]"><Package className="size-5" /></span>
            <span className="font-display text-xl font-bold tracking-[-0.04em]">nex<span className="text-[#f35b24]">shipping</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/tracking" className="hidden text-sm text-white/65 hover:text-white sm:block">Track a shipment</Link>
            <button onClick={() => auth.logout()} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 hover:border-white/30 hover:text-white">
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="bg-[#071b2f] pb-16 pt-10 text-white sm:pb-20">
        <div className="container">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff8358]">Customer portal</p>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Good to see you, {auth.user?.name?.split(" ")[0] ?? "there"}.</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">Your private view of every shipment and quote request connected to {auth.user?.email ?? "your account"}.</p>
            </div>
            <Button asChild className="w-fit rounded-full bg-[#f35b24] text-white hover:bg-[#df4d1a]"><Link href="/quote">Request a quote <ArrowRight className="size-4" /></Link></Button>
          </div>
        </div>
      </section>

      <section className="container -mt-8 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric icon={Truck} label="Active shipments" value={String(activeShipments)} />
          <Metric icon={Quote} label="Quote requests" value={String(quotes.length)} />
          <Metric icon={ShieldCheck} label="Account status" value="Verified" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-3xl bg-white p-6 shadow-[0_18px_50px_rgba(17,38,61,0.06)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c9aa8]">Your shipments</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">Everything in motion.</h2></div>
              <Package className="size-5 text-[#f35b24]" />
            </div>
            <div className="mt-7 grid gap-3">
              {dashboard.isLoading && <LoadingRows />}
              {!dashboard.isLoading && shipments.map(shipment => (
                <div key={shipment.id} className="rounded-2xl border border-[#e1e7ed] p-4 sm:p-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8c9aa8]">{shipment.trackingNumber}</p><p className="mt-2 font-semibold">{shipment.origin} <span className="px-1 text-[#f35b24]">→</span> {shipment.destination}</p></div>
                    <span className="w-fit rounded-full bg-[#d7eee8] px-3 py-1.5 text-xs font-bold text-[#13715a]">{shipmentLabels[shipment.status] ?? shipment.status}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#6d7784]"><span>Current location: <strong className="text-[#263b50]">{shipment.currentLocation ?? "In network"}</strong></span><span>Est. delivery: <strong className="text-[#263b50]">{formatDate(shipment.estimatedDelivery)}</strong></span></div>
                  <Link href="/tracking" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#f35b24]">View live tracking <ArrowRight className="size-4" /></Link>
                </div>
              ))}
              {!dashboard.isLoading && shipments.length === 0 && <EmptyState icon={Package} title="No shipments yet" text="Once your first shipment is created, it will appear here with its latest verified milestone." />}
            </div>
          </section>

          <section className="rounded-3xl bg-[#eaf0f3] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c9aa8]">Quote history</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">Your requests.</h2></div><Sparkles className="size-5 text-[#f35b24]" /></div>
            <div className="mt-7 grid gap-3">
              {quotes.map(quote => <div key={quote.id} className="rounded-2xl bg-white p-4"><div className="flex items-start justify-between gap-3"><p className="font-semibold">{quote.origin} <span className="text-[#f35b24]">→</span> {quote.destination}</p><span className="rounded-full bg-[#fff0e9] px-2 py-1 text-[10px] font-bold uppercase text-[#c94714]">{quoteLabels[quote.status] ?? quote.status}</span></div><p className="mt-2 text-xs text-[#6d7784]">{quote.shipmentType} · requested {formatDate(quote.createdAt)}</p></div>)}
              {quotes.length === 0 && <EmptyState icon={Quote} title="No quote requests yet" text="Tell us what needs to move and we’ll save the request here for you." />}
            </div>
            <Button asChild variant="outline" className="mt-6 w-full rounded-full border-[#cbd5dd] bg-transparent"><Link href="/quote">Start a new quote <ArrowRight className="size-4" /></Link></Button>
          </section>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d7eee8] bg-[#f4fbf8] p-4 text-sm text-[#356c5e]"><Clock3 className="mt-0.5 size-4 shrink-0" /><span>Shipment information is sourced from Nexshipping’s operations database. If something looks out of date, <Link href="/contact" className="font-semibold underline underline-offset-2">contact our support team</Link>.</span></div>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return <div className="rounded-2xl border border-[#e1e7ed] bg-white p-5 shadow-[0_12px_35px_rgba(17,38,61,0.05)]"><Icon className="size-5 text-[#f35b24]" /><p className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#8c9aa8]">{label}</p></div>;
}

function LoadingRows() {
  return <>{[1, 2].map(item => <div key={item} className="h-28 animate-pulse rounded-2xl bg-[#f6f7f9]" />)}</>;
}

function EmptyState({ icon: Icon, title, text }: { icon: typeof Package; title: string; text: string }) {
  return <div className="rounded-2xl border border-dashed border-[#cbd5dd] p-6 text-center"><Icon className="mx-auto size-6 text-[#f35b24]" /><p className="mt-3 font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-[#6d7784]">{text}</p></div>;
}
