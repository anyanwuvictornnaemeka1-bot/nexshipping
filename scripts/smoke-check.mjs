const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const routes = [
  "/",
  "/about",
  "/services",
  "/tracking",
  "/quote",
  "/contact",
  "/faq",
  "/news",
  "/privacy",
  "/terms",
  "/login",
  "/dashboard",
  "/admin",
];
for (const route of routes) {
  const response = await fetch(`${base}${route}`);
  if (!response.ok) throw new Error(`${route} returned ${response.status}`);
  const body = await response.text();
  if (!body.includes('<div id="root"></div>'))
    throw new Error(`${route} missing app root`);
  console.log(`${route} ${response.status}`);
}
const tracking = await fetch(
  `${base}/api/trpc/tracking.lookup?input=${encodeURIComponent(JSON.stringify({ json: { trackingNumber: "NX-DOES-NOT-EXIST" } }))}`
);
if (!tracking.ok) throw new Error(`tracking API returned ${tracking.status}`);
console.log(`tracking API ${tracking.status}`);
