import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user?: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

const adminUser: NonNullable<TrpcContext["user"]> = {
  id: 1,
  openId: "admin-user",
  name: "Operations Admin",
  email: "ops@nexshipping.com",
  loginMethod: "manus",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("nexshipping public procedures", () => {
  it("returns an empty result for an unknown tracking number instead of fabricating data", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.tracking.lookup({
      trackingNumber: "NX-DOES-NOT-EXIST",
    });
    expect(result).toBeNull();
  });

  it("rejects malformed quote requests before database work", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      caller.quote.create({
        fullName: "Test User",
        email: "not-an-email",
        origin: "Chicago",
        destination: "Rotterdam",
        shipmentType: "Ocean freight",
        cargoDescription: "A pallet",
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects malformed contact requests before database work", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      caller.contact.create({
        name: "Test User",
        email: "not-an-email",
        message: "Please contact me",
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects malformed newsletter subscriptions before database work", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      caller.newsletter.subscribe({ email: "not-an-email" })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("protects admin overview from unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.admin.overview()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("protects shipment creation from unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      caller.admin.createShipment({
        trackingNumber: "NX-2048-AC",
        origin: "Chicago",
        destination: "Rotterdam",
        shipmentType: "ocean",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("validates shipment events before attempting persistence", async () => {
    const caller = appRouter.createCaller(createContext(adminUser));
    await expect(
      caller.admin.addShipmentEvent({
        shipmentId: 1,
        status: "in_transit",
        title: "",
        eventTime: new Date(),
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("protects shipment editing and deletion from unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      caller.admin.updateShipment({ id: 1, data: { origin: "Chicago" } })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.admin.deleteShipment({ id: 1 })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("exposes shipment audit activity to authenticated admins", async () => {
    const caller = appRouter.createCaller(createContext(adminUser));
    const result = await caller.admin.overview();
    expect(result).toHaveProperty("auditLogs");
    expect(Array.isArray(result.auditLogs)).toBe(true);
  });

  it("rejects empty bulk imports before database work", async () => {
    const caller = appRouter.createCaller(createContext(adminUser));
    await expect(
      caller.admin.bulkCreateShipments({ shipments: [] })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
