import { describe, expect, it } from "vitest";
import { jwtVerify } from "jose";
import { ENV, validateJwtSecret } from "./_core/env";
import { sdk } from "./_core/sdk";

describe("production JWT secret validation", () => {
  it("accepts a 32-character secret", () => {
    expect(() => validateJwtSecret("a".repeat(32))).not.toThrow();
  });

  it("rejects secrets shorter than 32 characters", () => {
    expect(() => validateJwtSecret("a".repeat(31))).toThrow(
      "at least 32 characters"
    );
  });

  it("signs and verifies a session with the configured secret", async () => {
    validateJwtSecret(ENV.cookieSecret);
    const token = await sdk.signSession({
      openId: "secret-validation-user",
      appId: "secret-validation-app",
      name: "Secret validation",
    });
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(ENV.cookieSecret),
      { algorithms: ["HS256"] }
    );
    expect(payload.openId).toBe("secret-validation-user");
  });
});
