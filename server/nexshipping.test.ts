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

  it("protects admin overview from unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.admin.overview()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
