import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./_core/trpc";
import {
  addShipmentEvent,
  createContact,
  createQuote,
  createShipments,
  createShipment,
  deleteShipment,
  findShipmentByTrackingNumber,
  getCustomerDashboard,
  getAdminOverview,
  getPublishedPostBySlug,
  getPublishedContent,
  getShipmentCount,
  recordShipmentAuditLog,
  subscribeToNewsletter,
  updateContactStatus,
  updateQuoteStatus,
  updateShipment,
} from "./db";
import { notifyOwner } from "./_core/notification";

const email = z.string().trim().email().max(320);
const nonEmpty = (max: number) => z.string().trim().min(1).max(max);
const shipmentType = z.enum(["air", "ocean", "road", "rail", "multimodal"]);
const shipmentStatus = z.enum([
  "booked",
  "in_transit",
  "customs",
  "out_for_delivery",
  "delivered",
  "exception",
]);
const shipmentInput = z.object({
  trackingNumber: nonEmpty(32),
  origin: nonEmpty(160),
  destination: nonEmpty(160),
  status: shipmentStatus.optional(),
  currentLocation: z.string().trim().max(160).optional(),
  estimatedDelivery: z.date().optional(),
  shipmentType,
  serviceLevel: z.string().trim().max(80).optional(),
  weight: z.string().trim().max(80).optional(),
  customerEmail: email.optional(),
});
const auditActor = (user: {
  id: number;
  name: string | null;
  email: string | null;
}) => ({
  actorId: user.id,
  actorName: user.name ?? "Nexshipping admin",
  actorEmail: user.email ?? undefined,
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  tracking: router({
    lookup: publicProcedure
      .input(z.object({ trackingNumber: nonEmpty(32) }))
      .query(async ({ input }) => {
        const tracking = await findShipmentByTrackingNumber(
          input.trackingNumber.toUpperCase()
        );
        return tracking ?? null;
      }),
  }),
  publicContent: router({
    home: publicProcedure.query(async () => getPublishedContent()),
    shipmentCount: publicProcedure.query(async () => ({
      count: await getShipmentCount(),
    })),
    postBySlug: publicProcedure
      .input(z.object({ slug: nonEmpty(180) }))
      .query(async ({ input }) => getPublishedPostBySlug(input.slug)),
  }),
  customer: router({
    dashboard: protectedProcedure.query(async ({ ctx }) =>
      getCustomerDashboard((ctx.user.email ?? "").toLowerCase(), ctx.user.openId)
    ),
  }),
  quote: router({
    create: publicProcedure
      .input(
        z.object({
          fullName: nonEmpty(160),
          email,
          phone: z.string().trim().max(60).optional(),
          company: z.string().trim().max(160).optional(),
          origin: nonEmpty(160),
          destination: nonEmpty(160),
          shipmentType: nonEmpty(80),
          cargoDescription: nonEmpty(4000),
          weight: z.string().trim().max(80).optional(),
          dimensions: z.string().trim().max(120).optional(),
          shippingMethod: z.string().trim().max(100).optional(),
          notes: z.string().trim().max(4000).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const id = await createQuote({
          ...input,
          email: input.email.toLowerCase(),
          customerOpenId: ctx.user?.openId,
        });
        const notificationDelivered = await notifyOwner({
          title: `New quote request from ${input.fullName}`,
          content: `${input.origin} → ${input.destination} · ${input.shipmentType}\nContact: ${input.email}\nRequest ID: ${id}`,
        }).catch(error => {
          console.warn("[Quote] Owner notification failed:", error);
          return false;
        });
        return { id, success: true, notificationDelivered };
      }),
  }),
  contact: router({
    create: publicProcedure
      .input(
        z.object({
          name: nonEmpty(160),
          email,
          phone: z.string().trim().max(60).optional(),
          subject: z.string().trim().max(180).optional(),
          message: nonEmpty(4000),
        })
      )
      .mutation(async ({ input }) => {
        const id = await createContact({ ...input, email: input.email.toLowerCase() });
        const notificationDelivered = await notifyOwner({
          title: `New contact message from ${input.name}`,
          content: `${input.subject ?? "General inquiry"}\nFrom: ${input.email}\nMessage ID: ${id}\n${input.message}`,
        }).catch(error => {
          console.warn("[Contact] Owner notification failed:", error);
          return false;
        });
        return { id, success: true, notificationDelivered };
      }),
  }),
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email }))
      .mutation(async ({ input }) => {
        await subscribeToNewsletter(input.email);
        return { success: true };
      }),
  }),
  admin: router({
    overview: adminProcedure.query(async () => getAdminOverview()),
    updateQuoteStatus: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["new", "reviewing", "quoted", "closed"]),
        })
      )
      .mutation(async ({ input }) => {
        if (!(await updateQuoteStatus(input.id, input.status))) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Quote not found." });
        }
        return { success: true };
      }),
    updateContactStatus: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["new", "read", "replied", "closed"]),
        })
      )
      .mutation(async ({ input }) => {
        if (!(await updateContactStatus(input.id, input.status))) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Contact not found." });
        }
        return { success: true };
      }),
    createShipment: adminProcedure
      .input(shipmentInput)
      .mutation(async ({ input, ctx }) => {
        const id = await createShipment({
          ...input,
          customerEmail: input.customerEmail?.toLowerCase(),
          status: input.status ?? "booked",
        });
        await recordShipmentAuditLog({
          shipmentId: Number(id),
          ...auditActor(ctx.user),
          action: "created",
          summary: `Created shipment ${input.trackingNumber}`,
          details: JSON.stringify(input),
        });
        return { id, success: true };
      }),
    updateShipment: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          data: shipmentInput.partial().refine(data => Object.keys(data).length > 0, {
            message: "At least one shipment field is required.",
          }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!(await updateShipment(input.id, input.data))) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Shipment not found." });
        }
        await recordShipmentAuditLog({
          shipmentId: input.id,
          ...auditActor(ctx.user),
          action: "updated",
          summary: `Updated shipment fields: ${Object.keys(input.data).join(", ")}`,
          details: JSON.stringify(input.data),
        });
        return { success: true };
      }),
    deleteShipment: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input, ctx }) => {
        if (!(await deleteShipment(input.id))) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Shipment not found." });
        }
        await recordShipmentAuditLog({
          shipmentId: input.id,
          ...auditActor(ctx.user),
          action: "deleted",
          summary: `Deleted shipment #${input.id}`,
        });
        return { success: true };
      }),
    bulkCreateShipments: adminProcedure
      .input(z.object({ shipments: z.array(shipmentInput).min(1).max(500) }))
      .mutation(async ({ input, ctx }) => {
        const ids = await createShipments(
          input.shipments.map(shipment => ({
            ...shipment,
            status: shipment.status ?? "booked",
          }))
        );
        await Promise.all(
          ids.map((id, index) =>
            recordShipmentAuditLog({
              shipmentId: Number(id),
              ...auditActor(ctx.user),
              action: "bulk_imported",
              summary: `Imported shipment ${input.shipments[index]?.trackingNumber ?? id}`,
              details: JSON.stringify({ source: "csv", row: index + 1 }),
            })
          )
        );
        return { ids, success: true };
      }),
    addShipmentEvent: adminProcedure
      .input(
        z.object({
          shipmentId: z.number().int().positive(),
          status: shipmentStatus,
          title: nonEmpty(160),
          description: z.string().trim().max(2000).optional(),
          location: z.string().trim().max(160).optional(),
          eventTime: z.date(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const id = await addShipmentEvent(input);
        if (!id) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Shipment not found." });
        }
        await recordShipmentAuditLog({
          shipmentId: input.shipmentId,
          ...auditActor(ctx.user),
          action: "event_added",
          summary: `Added event: ${input.title}`,
          details: JSON.stringify({
            status: input.status,
            location: input.location,
            eventTime: input.eventTime,
          }),
        });
        return { id, success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
