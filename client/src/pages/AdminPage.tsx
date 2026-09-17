import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  History,
  Inbox,
  LogOut,
  MessageSquare,
  Package,
  Pencil,
  RefreshCw,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { loadGoogleMaps } from "@/components/Map";
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
  const createShipment = trpc.admin.createShipment.useMutation({
    onSuccess: () => {
      toast.success("Shipment created.");
      overview.refetch();
    },
    onError: error => toast.error(error.message),
  });
  const addShipmentEvent = trpc.admin.addShipmentEvent.useMutation({
    onSuccess: () => {
      toast.success("Shipment event added and status updated.");
      overview.refetch();
    },
    onError: error => toast.error(error.message),
  });
  const updateShipment = trpc.admin.updateShipment.useMutation({
    onSuccess: () => {
      toast.success("Shipment updated.");
      overview.refetch();
    },
    onError: error => toast.error(error.message),
  });
  const deleteShipment = trpc.admin.deleteShipment.useMutation({
    onSuccess: () => {
      toast.success("Shipment deleted.");
      overview.refetch();
    },
    onError: error => toast.error(error.message),
  });
  const bulkCreateShipments = trpc.admin.bulkCreateShipments.useMutation({
    onSuccess: result => {
      toast.success(`${result.ids.length} shipments imported.`);
      overview.refetch();
    },
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
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <Panel
                title="Create shipment"
                action={() => undefined}
                actionLabel="Admin only"
              >
                <ShipmentForm
                  pending={createShipment.isPending}
                  onSubmit={values => createShipment.mutate(values)}
                />
              </Panel>
              <Panel
                title="Shipment management"
                action={() => overview.refetch()}
                actionLabel="Refresh"
              >
                <div className="mb-6 rounded-2xl border border-dashed border-[#cbd5dd] bg-[#f6f7f9] p-4 sm:p-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-bold">
                        <FileSpreadsheet className="size-4 text-[#f35b24]" />
                        Bulk import shipments
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#617083]">
                        Upload a CSV with trackingNumber, origin, destination,
                        shipmentType, and optional status, location, delivery,
                        service, weight, customerEmail.
                      </p>
                    </div>
                    <label className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#071b2f] px-4 text-xs font-bold text-white hover:bg-[#16344f]">
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        className="sr-only"
                        disabled={bulkCreateShipments.isPending}
                        onChange={event => {
                          const file = event.target.files?.[0];
                          if (file)
                            parseShipmentCsv(file)
                              .then(rows =>
                                bulkCreateShipments.mutate({ shipments: rows })
                              )
                              .catch(error => toast.error(error.message));
                          event.currentTarget.value = "";
                        }}
                      />
                      {bulkCreateShipments.isPending
                        ? "Importing…"
                        : "Choose CSV"}
                    </label>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[780px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#e1e7ed] text-xs uppercase tracking-[0.12em] text-[#8c9aa8]">
                          <th className="pb-3 font-semibold">Tracking</th>
                          <th className="pb-3 font-semibold">Route</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold">Updated</th>
                          <th className="pb-3 font-semibold">Add event</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.shipments ?? []).map(shipment => (
                          <ShipmentRow
                            key={shipment.id}
                            shipment={shipment}
                            pending={addShipmentEvent.isPending}
                            onSubmit={values => addShipmentEvent.mutate(values)}
                            onEdit={values => updateShipment.mutate(values)}
                            onDelete={id => {
                              if (
                                window.confirm(
                                  "Delete this shipment and its event history?"
                                )
                              )
                                deleteShipment.mutate({ id });
                            }}
                          />
                        ))}
                      </tbody>
                    </table>
                    {!data?.shipments.length && (
                      <EmptyState label="No shipments have been added" />
                    )}
                  </div>
                </div>
              </Panel>
              <Panel
                title="Shipment audit activity"
                action={() => overview.refetch()}
                actionLabel="Refresh"
              >
                <div className="grid gap-3">
                  {(data?.auditLogs ?? []).slice(0, 12).map(log => (
                    <div
                      key={log.id}
                      className="flex flex-col gap-2 rounded-xl border border-[#e1e7ed] p-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="flex min-w-0 gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eaf0f3] text-[#13715a]">
                          <History className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{log.summary}</p>
                          <p className="mt-1 text-xs text-[#617083]">
                            Shipment #{log.shipmentId} · {log.actorName}
                            {log.actorEmail ? ` · ${log.actorEmail}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
                        <span className="rounded-full bg-[#fff0e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#c94714]">
                          {log.action.replaceAll("_", " ")}
                        </span>
                        <span className="text-[11px] text-[#8c9aa8]">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {!data?.auditLogs?.length && (
                    <EmptyState label="No shipment changes recorded yet" />
                  )}
                </div>
              </Panel>
            </div>
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

type ShipmentFormValues = {
  trackingNumber: string;
  origin: string;
  destination: string;
  status?: ShipmentStatus;
  currentLocation?: string;
  estimatedDelivery?: Date;
  shipmentType: "air" | "ocean" | "road" | "rail" | "multimodal";
  serviceLevel?: string;
  weight?: string;
  customerEmail?: string;
};

function ShipmentForm({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (values: ShipmentFormValues) => void;
}) {
  return (
    <form
      className="grid gap-4"
      onSubmit={event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const estimated = String(form.get("estimatedDelivery") ?? "");
        onSubmit({
          trackingNumber: String(form.get("trackingNumber") ?? "")
            .trim()
            .toUpperCase(),
          origin: String(form.get("origin") ?? "").trim(),
          destination: String(form.get("destination") ?? "").trim(),
          currentLocation:
            String(form.get("currentLocation") ?? "").trim() || undefined,
          estimatedDelivery: estimated
            ? new Date(`${estimated}T12:00:00`)
            : undefined,
          shipmentType: String(
            form.get("shipmentType") ?? "ocean"
          ) as ShipmentFormValues["shipmentType"],
          serviceLevel:
            String(form.get("serviceLevel") ?? "").trim() || undefined,
          weight: String(form.get("weight") ?? "").trim() || undefined,
          customerEmail:
            String(form.get("customerEmail") ?? "").trim() || undefined,
        });
        event.currentTarget.reset();
      }}
    >
      <Field label="Tracking number *">
        <input
          required
          name="trackingNumber"
          placeholder="NX-2048-AC"
          className="admin-input"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Origin *">
          <input
            required
            name="origin"
            placeholder="Chicago, IL"
            className="admin-input"
          />
        </Field>
        <Field label="Destination *">
          <input
            required
            name="destination"
            placeholder="Rotterdam, NL"
            className="admin-input"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mode">
          <Select
            name="shipmentType"
            options={[
              ["ocean", "Ocean"],
              ["air", "Air"],
              ["road", "Road"],
              ["rail", "Rail"],
              ["multimodal", "Multimodal"],
            ]}
          />
        </Field>
        <Field label="Estimated delivery">
          <input type="date" name="estimatedDelivery" className="admin-input" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current location">
          <input
            name="currentLocation"
            placeholder="In transit"
            className="admin-input"
          />
        </Field>
        <Field label="Service level">
          <input
            name="serviceLevel"
            placeholder="Priority"
            className="admin-input"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Weight">
          <input name="weight" placeholder="240 kg" className="admin-input" />
        </Field>
        <Field label="Customer email">
          <input
            type="email"
            name="customerEmail"
            placeholder="ops@customer.com"
            className="admin-input"
          />
        </Field>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-11 rounded-xl bg-[#f35b24] text-white hover:bg-[#df4d1a]"
      >
        <Package className="size-4" />
        {pending ? "Creating…" : "Create shipment"}
      </Button>
    </form>
  );
}

function EditShipmentForm({
  shipment,
  onCancel,
  onSubmit,
}: {
  shipment: {
    trackingNumber: string;
    origin: string;
    destination: string;
    status: string;
  };
  onCancel: () => void;
  onSubmit: (values: Partial<ShipmentFormValues>) => void;
}) {
  return (
    <form
      className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] lg:items-end"
      onSubmit={event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        onSubmit({
          trackingNumber: String(form.get("trackingNumber"))
            .trim()
            .toUpperCase(),
          origin: String(form.get("origin")).trim(),
          destination: String(form.get("destination")).trim(),
          status: String(form.get("status")) as ShipmentStatus,
        });
      }}
    >
      <Field label="Tracking number">
        <input
          required
          name="trackingNumber"
          defaultValue={shipment.trackingNumber}
          className="admin-input"
        />
      </Field>
      <Field label="Origin">
        <input
          required
          name="origin"
          defaultValue={shipment.origin}
          className="admin-input"
        />
      </Field>
      <Field label="Destination">
        <input
          required
          name="destination"
          defaultValue={shipment.destination}
          className="admin-input"
        />
      </Field>
      <Field label="Status">
        <Select
          name="status"
          defaultValue={shipment.status}
          options={[
            ["booked", "Booked"],
            ["in_transit", "In transit"],
            ["customs", "Customs"],
            ["out_for_delivery", "Out for delivery"],
            ["delivered", "Delivered"],
            ["exception", "Exception"],
          ]}
        />
      </Field>
      <Button
        type="submit"
        className="h-11 rounded-xl bg-[#13715a] text-white hover:bg-[#0d5d4a]"
      >
        <Pencil className="size-4" />
        Save
      </Button>
      <Button
        type="button"
        onClick={onCancel}
        variant="outline"
        className="h-11 rounded-xl"
      >
        <ChevronDown className="size-4 rotate-90" />
        Cancel
      </Button>
    </form>
  );
}

type ShipmentStatus =
  | "booked"
  | "in_transit"
  | "customs"
  | "out_for_delivery"
  | "delivered"
  | "exception";

type ShipmentEventValues = {
  shipmentId: number;
  status: ShipmentStatus;
  title: string;
  description?: string;
  location?: string;
  eventTime: Date;
};

async function parseShipmentCsv(file: File): Promise<ShipmentFormValues[]> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2)
    throw new Error("CSV must include a header row and at least one shipment.");
  const headers = parseCsvLine(lines[0]).map(value => value.trim());
  const required = ["trackingNumber", "origin", "destination", "shipmentType"];
  const missing = required.filter(field => !headers.includes(field));
  if (missing.length)
    throw new Error(`CSV is missing required columns: ${missing.join(", ")}`);
  const rows = lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""])
    );
    return {
      trackingNumber: row.trackingNumber.trim().toUpperCase(),
      origin: row.origin.trim(),
      destination: row.destination.trim(),
      shipmentType:
        row.shipmentType.trim() as ShipmentFormValues["shipmentType"],
      status: (row.status || undefined) as ShipmentStatus | undefined,
      currentLocation: row.currentLocation || undefined,
      estimatedDelivery: row.estimatedDelivery
        ? new Date(`${row.estimatedDelivery}T12:00:00`)
        : undefined,
      serviceLevel: row.serviceLevel || undefined,
      weight: row.weight || undefined,
      customerEmail: row.customerEmail || undefined,
    };
  });
  if (rows.length > 500)
    throw new Error("CSV import is limited to 500 shipments per upload.");
  return rows;
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) {
      values.push(value);
      value = "";
    } else value += character;
  }
  values.push(value);
  return values;
}

function ShipmentRow({
  shipment,
  pending,
  onSubmit,
  onEdit,
  onDelete,
}: {
  shipment: {
    id: number;
    trackingNumber: string;
    origin: string;
    destination: string;
    status: string;
    lastUpdate: Date;
  };
  pending: boolean;
  onSubmit: (values: ShipmentEventValues) => void;
  onEdit: (values: { id: number; data: Partial<ShipmentFormValues> }) => void;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  return (
    <>
      <tr className="border-b border-[#e1e7ed] last:border-0">
        <td className="py-4 font-semibold">{shipment.trackingNumber}</td>
        <td className="py-4 text-[#617083]">
          {shipment.origin} → {shipment.destination}
        </td>
        <td className="py-4">
          <span className="rounded-full bg-[#d7eee8] px-2.5 py-1 text-xs font-bold capitalize text-[#13715a]">
            {shipment.status.replaceAll("_", " ")}
          </span>
        </td>
        <td className="py-4 text-[#8c9aa8]">
          {new Date(shipment.lastUpdate).toLocaleDateString()}
        </td>
        <td className="py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(!editing)}
              className="grid size-8 place-items-center rounded-lg bg-[#eaf0f3] text-[#122235]"
              aria-label="Edit shipment"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(shipment.id)}
              className="grid size-8 place-items-center rounded-lg bg-[#fff0e9] text-[#c94714]"
              aria-label="Delete shipment"
            >
              <Trash2 className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#d7eee8] px-3 py-2 text-xs font-bold text-[#13715a]"
            >
              Event{" "}
              <ChevronDown
                className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </td>
      </tr>
      {editing && (
        <tr className="border-b border-[#e1e7ed]">
          <td colSpan={5} className="bg-[#f6f7f9] p-4">
            <EditShipmentForm
              shipment={shipment}
              onCancel={() => setEditing(false)}
              onSubmit={values => {
                onEdit({ id: shipment.id, data: values });
                setEditing(false);
              }}
            />
          </td>
        </tr>
      )}
      {open && (
        <tr className="border-b border-[#e1e7ed]">
          <td colSpan={5} className="bg-[#f6f7f9] p-4">
            <EventForm
              shipmentId={shipment.id}
              pending={pending}
              onSubmit={onSubmit}
            />
          </td>
        </tr>
      )}
    </>
  );
}

function EventForm({
  shipmentId,
  pending,
  onSubmit,
}: {
  shipmentId: number;
  pending: boolean;
  onSubmit: (values: ShipmentEventValues) => void;
}) {
  const locationRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | undefined;
    loadGoogleMaps()
      .then(() => {
        if (locationRef.current && window.google?.maps?.places) {
          autocomplete = new window.google.maps.places.Autocomplete(
            locationRef.current,
            { fields: ["formatted_address", "name"] }
          );
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete?.getPlace();
            if (locationRef.current && place) {
              locationRef.current.value =
                place.formatted_address ?? place.name ?? "";
            }
          });
        }
      })
      .catch(() => undefined);
    return () => {
      if (autocomplete) {
        window.google?.maps?.event.clearInstanceListeners(autocomplete);
      }
    };
  }, []);
  return (
    <form
      className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end"
      onSubmit={event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        onSubmit({
          shipmentId,
          status: String(form.get("status")) as ShipmentStatus,
          title: String(form.get("title")).trim(),
          description:
            String(form.get("description") ?? "").trim() || undefined,
          location: String(form.get("location") ?? "").trim() || undefined,
          eventTime: new Date(String(form.get("eventTime"))),
        });
        event.currentTarget.reset();
      }}
    >
      <Field label="Status">
        <Select
          name="status"
          options={[
            ["booked", "Booked"],
            ["in_transit", "In transit"],
            ["customs", "Customs"],
            ["out_for_delivery", "Out for delivery"],
            ["delivered", "Delivered"],
            ["exception", "Exception"],
          ]}
        />
      </Field>
      <Field label="Milestone title">
        <input
          required
          name="title"
          placeholder="Departed origin facility"
          className="admin-input"
        />
      </Field>
      <Field label="Location">
        <input
          ref={locationRef}
          name="location"
          placeholder="Search a city, port, or facility"
          autoComplete="off"
          className="admin-input"
        />
      </Field>
      <Field label="Event time">
        <input
          required
          type="datetime-local"
          name="eventTime"
          defaultValue={new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16)}
          className="admin-input"
        />
      </Field>
      <Button
        type="submit"
        disabled={pending}
        className="h-10 rounded-xl bg-[#071b2f] text-white hover:bg-[#16344f]"
      >
        <Send className="size-4" />
        {pending ? "Saving" : "Add event"}
      </Button>
      <div className="lg:col-span-full">
        <Field label="Description">
          <input
            name="description"
            placeholder="Cargo handed to linehaul partner"
            className="admin-input"
          />
        </Field>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#8c9aa8]">
      <span>{label}</span>
      <div className="mt-2 normal-case tracking-normal">{children}</div>
    </label>
  );
}
function Select({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: Array<[string, string]>;
  defaultValue?: string;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        defaultValue={defaultValue ?? options[0][0]}
        className="admin-input appearance-none pr-9"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-[#8c9aa8]" />
    </div>
  );
}
