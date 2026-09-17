export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

export function validateProductionEnvironment() {
  if (!ENV.isProduction) return;
  const required: Array<[string, string]> = [
    ["DATABASE_URL", ENV.databaseUrl],
    ["JWT_SECRET", ENV.cookieSecret],
    ["VITE_APP_ID", ENV.appId],
    ["OAUTH_SERVER_URL", ENV.oAuthServerUrl],
    ["OWNER_OPEN_ID", ENV.ownerOpenId],
    ["BUILT_IN_FORGE_API_URL", ENV.forgeApiUrl],
    ["BUILT_IN_FORGE_API_KEY", ENV.forgeApiKey],
  ];
  const missing = required.filter(([, value]) => !value).map(([name]) => name);
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }
  if (ENV.cookieSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production.");
  }
  try {
    new URL(ENV.oAuthServerUrl);
  } catch {
    throw new Error("OAUTH_SERVER_URL must be a valid absolute URL in production.");
  }
}
