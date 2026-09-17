const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const routes = [
  "/healthz",
  "/health",
  "/readyz",
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
  if (route === "/health" || route === "/healthz" || route === "/readyz") {
    if (!body.includes('"ok":true')) throw new Error(`${route} missing ok response`);
    console.log(`${route} ${response.status}`);
    continue;
  }
  if (!body.includes('<div id="root"></div>'))
    throw new Error(`${route} missing app root`);
  console.log(`${route} ${response.status}`);
}
const tracking = await fetch(
  `${base}/api/trpc/tracking.lookup?input=${encodeURIComponent(JSON.stringify({ json: { trackingNumber: "NX-DOES-NOT-EXIST" } }))}`
);
if (!tracking.ok) throw new Error(`tracking API returned ${tracking.status}`);
console.log(`tracking API ${tracking.status}`);
const robots = await fetch(`${base}/robots.txt`);
if (!robots.ok || !(await robots.text()).includes("Sitemap:")) throw new Error("robots.txt is invalid");
const sitemap = await fetch(`${base}/sitemap.xml`);
if (!sitemap.ok || !(await sitemap.text()).includes("https://nexshipping.com/")) throw new Error("sitemap.xml is invalid");
console.log(`crawler files ${robots.status}/${sitemap.status}`);
