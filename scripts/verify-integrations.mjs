import { notifyOwner } from "../server/_core/notification.ts";

const forgeUrl = process.env.BUILT_IN_FORGE_API_URL ?? "";
const forgeKey = process.env.BUILT_IN_FORGE_API_KEY ?? "";
const frontendMapsUrl = process.env.VITE_FRONTEND_FORGE_API_URL ?? "";
const frontendMapsKey = process.env.VITE_FRONTEND_FORGE_API_KEY ?? "";

console.log(JSON.stringify({
  forgeUrlConfigured: Boolean(forgeUrl),
  forgeKeyConfigured: Boolean(forgeKey),
  frontendMapsUrlConfigured: Boolean(frontendMapsUrl),
  frontendMapsKeyConfigured: Boolean(frontendMapsKey),
  frontendMapsProxyUrl: frontendMapsUrl ? `${frontendMapsUrl.replace(/\/$/, "")}/v1/maps/proxy` : null,
}, null, 2));

if (frontendMapsUrl && frontendMapsKey) {
  const mapsUrl = `${frontendMapsUrl.replace(/\/$/, "")}/v1/maps/proxy/maps/api/js?key=${encodeURIComponent(frontendMapsKey)}&v=weekly&libraries=marker,places,geocoding,geometry`;
  try {
    const response = await fetch(mapsUrl, { signal: AbortSignal.timeout(10000) });
    console.log(JSON.stringify({ mapsProxyStatus: response.status, mapsProxyReachable: response.ok }));
  } catch (error) {
    console.log(JSON.stringify({ mapsProxyStatus: "error", mapsProxyReachable: false, reason: String(error) }));
  }
} else {
  console.log(JSON.stringify({ mapsProxyStatus: "not-tested", mapsProxyReachable: false }));
}

if (!forgeUrl || !forgeKey) {
  console.log(JSON.stringify({ notificationDelivery: "not-tested", reason: "Forge notification credentials unavailable in this process" }));
  process.exit(0);
}

const delivered = await notifyOwner({
  title: "Nexshipping integration verification",
  content: "Non-production verification message: the configured owner-notification path was exercised successfully if delivery=true.",
});
console.log(JSON.stringify({ notificationDelivery: delivered ? "accepted" : "rejected" }));
