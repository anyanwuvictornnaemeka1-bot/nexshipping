import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  addShipmentEvent,
  createContact,
  createQuote,
  createShipment,
  findShipmentByTrackingNumber,
  getAdminOverview,
  getPublishedContent,
  getShipmentCount,
  subscribeToNewsletter,
  updateContactStatus,
  updateQuoteStatus,
} from "./db";

const email = z.string().trim().email().max(320);
const nonEmpty = (max: number) => z.string().trim().min(1).max(max);

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
      .mutation(async ({ input }) => ({
        id: await createQuote(input),
        success: true,
      })),
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
      .mutation(async ({ input }) => ({
        id: await createContact(input),
        success: true,
      })),
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
        await updateQuoteStatus(input.id, input.status);
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
        await updateContactStatus(input.id, input.status);
        return { success: true };
      }),
    createShipment: adminProcedure
      .input(
        z.object({
          trackingNumber: nonEmpty(32),
          origin: nonEmpty(160),
          destination: nonEmpty(160),
          currentLocation: z.string().trim().max(160).optional(),
          estimatedDelivery: z.date().optional(),
          shipmentType: z.enum(["air", "ocean", "road", "rail", "multimodal"]),
          serviceLevel: z.string().trim().max(80).optional(),
          weight: z.string().trim().max(80).optional(),
          customerEmail: email.optional(),
        })
      )
      .mutation(async ({ input }) => ({
        id: await createShipment(input),
        success: true,
      })),
    addShipmentEvent: adminProcedure
      .input(
        z.object({
          shipmentId: z.number().int().positive(),
          status: nonEmpty(80),
          title: nonEmpty(160),
          description: z.string().trim().max(2000).optional(),
          location: z.string().trim().max(160).optional(),
          eventTime: z.date(),
        })
      )
      .mutation(async ({ input }) => ({
        id: await addShipmentEvent(input),
        success: true,
      })),
  }),
});

export type AppRouter = typeof appRouter;
