import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Inbox,
  LogOut,
  MessageSquare,
  Package,
  RefreshCw,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  new: "bg-[#fff0e9] text-[#c94714]",
  reviewing: "bg-[#fff7d6] text-[#856600]",
  quoted: "bg-[#d7eee8] text-[#13715a]",
  closed: "bg-[#eaf0f3] text-[#617083]",
  read: "bg-[#eaf0f3] text-[#617083]",
  replied: "bg-[#d7eee8] text-[#13715a]",
};

export default function AdminPage() {
  const auth = useAuth();
  const [tab, setTab] = useState<
    "overview" | "shipments" | "quotes" | "contacts"
  >("overview");
  const overview = trpc.admin.overview.useQuery(undefined, {
    enabled: auth.user?.role === "admin",
    retry: false,
  });
  const quoteStatus = trpc.admin.updateQuoteStatus.useMutation({
    onSuccess: () => overview.refetch(),
    onError: error => toast.error(error.message),
  });
  const contactStatus = trpc.admin.updateContactStatus.useMutation({
    onSuccess: () => overview.refetch(),
    onError: error => toast.error(error.message),
  });

  if (auth.loading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#071b2f] text-white">
        <RefreshCw className="size-6 animate-spin text-[#ff8358]" />
      </div>
    );
  if (!auth.isAuthenticated)
    return (
      <div className="grid min-h-screen place-items-center bg-[#071b2f] px-5 text-center text-white">
        <div>
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f35b24]">
            <Package className="size-7" />
          </div>
          <h1 className="mt-7 font-display text-4xl font-semibold tracking-[-0.05em]">
            Nexshipping operations
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/55">
            Sign in with your authorized Nexshipping account to access shipment
            and customer operations.
          </p>
          <Button
            onClick={startLogin}
            className="mt-8 rounded-full bg-[#f35b24] text-white hover:bg-[#df4d1a]"
          >
            Sign in to continue <ArrowRight className="size-4" />
          </Button>
          <Link
            href="/"
            className="mt-5 block text-sm text-white/45 hover:text-white"
          >
            Back to public site
          </Link>
        </div>
      </div>
    );
  if (auth.user?.role !== "admin")
    return (
      <div className="grid min-h-screen place-items-center bg-[#071b2f] px-5 text-center text-white">
        <div>
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#fff0e9] text-[#f35b24]">
            <Inbox className="size-7" />
          </div>
          <h1 className="mt-7 font-display text-4xl font-semibold tracking-[-0.05em]">
            Access restricted
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/55">
            Your account is signed in, but it does not have operations
            administrator access.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ff8358]"
          >
            Return to Nexshipping <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  const user = auth.user;
  const data = overview.data;
  const nav = [
    ["overview", "Overview", Box],
    ["shipments", "Shipments", Package],
    ["quotes", "Quote requests", MessageSquare],
    ["contacts", "Messages", Inbox],
  ] as const;
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#122235]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#071b2f] text-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <span className="grid size-9 place-items-center rounded-xl bg-[#f35b24]">
            <Package className="size-5" />
          </span>
          <span className="font-display text-lg font-bold">
            nex<span className="text-[#f35b24]">shipping</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${tab === id ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/50 hover:text-white"
          >
            <ArrowRight className="size-4 rotate-180" />
            Public site
          </Link>
          <button
            onClick={() => auth.logout()}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/50 hover:text-white"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="lg:pl-64">
        <header className="flex min-h-20 items-center justify-between border-b border-[#e1e7ed] bg-white px-5 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c9aa8]">
              Operations portal
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em]">
              {nav.find(([id]) => id === tab)?.[1]}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user.name ?? "Admin"}</p>
              <p className="text-xs text-[#8c9aa8]">Administrator</p>
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-[#eaf0f3] text-sm font-bold">
              {(user.name ?? "A").slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <div className="p-5 sm:p-8">
          {tab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  icon={Package}
                  label="Active shipments"
                  value={String(data?.shipments.length ?? 0)}
                  accent="navy"
                />
                <Metric
                  icon={MessageSquare}
                  label="Open quotes"
                  value={String(
                    data?.quotes.filter(item => item.status !== "closed")
                      .length ?? 0
                  )}
                  accent="orange"
                />
                <Metric
                  icon={Inbox}
                  label="Unread messages"
                  value={String(
                    data?.contacts.filter(item => item.status === "new")
                      .length ?? 0
                  )}
                  accent="teal"
                />
                <Metric
                  icon={Users}
                  label="Subscribers"
                  value={String(data?.subscribers ?? 0)}
                  accent="slate"
                />
              </div>
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Panel
                  title="Recent quote requests"
                  action={() => setTab("quotes")}
                  actionLabel="View all"
                >
                  <QuoteTable
                    rows={(data?.quotes ?? []).slice(0, 5)}
                    onStatus={(id, status) =>
                      quoteStatus.mutate({ id, status })
                    }
                  />
                </Panel>
                <Panel
                  title="Latest messages"
                  action={() => setTab("contacts")}
                  actionLabel="View all"
                >
                  <div className="grid gap-1">
                    {(data?.contacts ?? []).slice(0, 5).map(message => (
                      <div
                        key={message.id}
                        className="flex items-start justify-between gap-3 rounded-xl px-3 py-3 hover:bg-[#f6f7f9]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {message.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-[#8c9aa8]">
                            {message.subject ?? "No subject"}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[message.status]}`}
                        >
                          {message.status}
                        </span>
                      </div>
                    ))}
                    {!data?.contacts.length && (
                      <EmptyState label="No messages yet" />
                    )}
                  </div>
                </Panel>
              </div>
            </>
          )}
          {tab === "shipments" && (
            <Panel
              title="Shipment management"
              action={() => overview.refetch()}
              actionLabel="Refresh"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e1e7ed] text-xs uppercase tracking-[0.12em] text-[#8c9aa8]">
                      <th className="pb-3 font-semibold">Tracking</th>
                      <th className="pb-3 font-semibold">Route</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.shipments ?? []).map(shipment => (
                      <tr
                        key={shipment.id}
                        className="border-b border-[#e1e7ed] last:border-0"
                      >
                        <td className="py-4 font-semibold">
                          {shipment.trackingNumber}
                        </td>
                        <td className="py-4 text-[#617083]">
                          {shipment.origin} → {shipment.destination}
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-[#d7eee8] px-2.5 py-1 text-xs font-bold text-[#13715a]">
                            {shipment.status.replaceAll("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 text-[#8c9aa8]">
                          {new Date(shipment.lastUpdate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!data?.shipments.length && (
                  <EmptyState label="No shipments have been added" />
                )}
              </div>
            </Panel>
          )}
          {tab === "quotes" && (
            <Panel
              title="Quote requests"
              action={() => overview.refetch()}
              actionLabel="Refresh"
            >
              <QuoteTable
                rows={data?.quotes ?? []}
                onStatus={(id, status) => quoteStatus.mutate({ id, status })}
              />
            </Panel>
          )}
          {tab === "contacts" && (
            <Panel
              title="Contact messages"
              action={() => overview.refetch()}
              actionLabel="Refresh"
            >
              <div className="grid gap-3">
                {(data?.contacts ?? []).map(message => (
                  <div
                    key={message.id}
                    className="rounded-xl border border-[#e1e7ed] p-5"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <p className="font-semibold">
                          {message.name}{" "}
                          <span className="font-normal text-[#8c9aa8]">
                            · {message.email}
                          </span>
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {message.subject ?? "General inquiry"}
                        </p>
                      </div>
                      <select
                        value={message.status}
                        onChange={event =>
                          contactStatus.mutate({
                            id: message.id,
                            status: event.target.value as never,
                          })
                        }
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-bold outline-none ${statusStyles[message.status]}`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#617083]">
                      {message.message}
                    </p>
                  </div>
                ))}
                {!data?.contacts.length && (
                  <EmptyState label="No messages yet" />
                )}
              </div>
            </Panel>
          )}
        </div>
      </main>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(17,38,61,0.04)]">
      <div
        className={`grid size-10 place-items-center rounded-xl ${accent === "orange" ? "bg-[#fff0e9] text-[#f35b24]" : accent === "teal" ? "bg-[#d7eee8] text-[#13715a]" : accent === "navy" ? "bg-[#eaf0f3] text-[#071b2f]" : "bg-[#eaf0f3] text-[#617083]"}`}
      >
        <Icon className="size-5" />
      </div>
      <p className="mt-5 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.13em] text-[#8c9aa8]">
        {label}
      </p>
    </div>
  );
}
function Panel({
  title,
  action,
  actionLabel,
  children,
}: {
  title: string;
  action: () => void;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(17,38,61,0.04)] sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold tracking-[-0.04em]">
          {title}
        </h2>
        <button
          onClick={action}
          className="text-xs font-bold uppercase tracking-[0.12em] text-[#f35b24]"
        >
          {actionLabel}
        </button>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
function QuoteTable({
  rows,
  onStatus,
}: {
  rows: Array<{
    id: number;
    fullName: string;
    email: string;
    origin: string;
    destination: string;
    shipmentType: string;
    status: string;
    createdAt: Date;
  }>;
  onStatus: (
    id: number,
    status: "new" | "reviewing" | "quoted" | "closed"
  ) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#e1e7ed] text-xs uppercase tracking-[0.12em] text-[#8c9aa8]">
            <th className="pb-3 font-semibold">Customer</th>
            <th className="pb-3 font-semibold">Lane</th>
            <th className="pb-3 font-semibold">Mode</th>
            <th className="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(quote => (
            <tr
              key={quote.id}
              className="border-b border-[#e1e7ed] last:border-0"
            >
              <td className="py-4">
                <p className="font-semibold">{quote.fullName}</p>
                <p className="mt-1 text-xs text-[#8c9aa8]">{quote.email}</p>
              </td>
              <td className="py-4 text-[#617083]">
                {quote.origin} → {quote.destination}
              </td>
              <td className="py-4 text-[#617083]">{quote.shipmentType}</td>
              <td className="py-4">
                <select
                  value={quote.status}
                  onChange={event =>
                    onStatus(quote.id, event.target.value as never)
                  }
                  className={`rounded-full border-0 px-2.5 py-1 text-xs font-bold outline-none ${statusStyles[quote.status]}`}
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <EmptyState label="No quote requests yet" />}
    </div>
  );
}
function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-8 text-center text-sm text-[#8c9aa8]">
      <CheckCircle2 className="mx-auto mb-3 size-6 text-[#cbd5dd]" />
      {label}
    </div>
  );
}
