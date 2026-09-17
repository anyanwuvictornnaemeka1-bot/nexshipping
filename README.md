# Nexshipping

Nexshipping is a production-oriented global shipping and logistics website built with React, Tailwind CSS, Express, tRPC, Drizzle, and Manus OAuth.

## Product surface

- Public marketing site with Home, About, Services, Tracking, Quote, Contact, FAQ, Insights, Privacy, and Terms routes.
- Database-backed shipment tracking lookup with event timeline and empty/error states.
- Quote and contact forms with server-side Zod validation and relational persistence.
- Newsletter subscription flow with duplicate-safe persistence.
- Protected admin operations portal at `/admin`, gated by the authenticated user's `admin` role.
- Admin overview for shipment records, quote request status management, contact message status management, and subscriber count.
- SEO metadata, Open Graph tags, `robots.txt`, and sitemap configuration.

## Local setup

```bash
pnpm install
pnpm check
pnpm test
pnpm build
pnpm dev
```

The template expects the following environment variables to be available through the WebDev runtime. Do not commit secrets or `.env` files:

- `DATABASE_URL` — MySQL/TiDB connection string.
- `JWT_SECRET` — session signing secret.
- `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` — Manus OAuth configuration.
- `OWNER_OPEN_ID`, `OWNER_NAME` — owner identity; the owner is promoted to admin by the auth upsert helper.
- `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` — server-side Manus services.
- `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY` — browser-safe proxy credentials used by prebuilt integrations.

## Database

The schema lives in `drizzle/schema.ts`. Generate a migration after schema changes:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

The main tables are `users`, `shipments`, `shipment_events`, `quotes`, `contacts`, `newsletter_subscribers`, `blog_posts`, `testimonials`, and `partners`.

For a real production rollout, operations should add shipment and shipment-event records through the protected admin workflow or an authenticated internal integration. The public tracking page intentionally returns an empty state when a number does not exist; it does not fabricate tracking data.

## Admin setup

Manus OAuth creates or updates the signed-in user. The owner identified by `OWNER_OPEN_ID` is promoted to `admin` by `upsertUser`. Additional operators can be promoted by updating their `users.role` value in the database. All admin procedures enforce `ctx.user.role === "admin"` server-side.

## Deployment notes

Use the WebDev project runtime and its managed preview/publish workflow. Media is stored through WebDev storage and referenced using `/manus-storage/...` paths rather than committed into the repository. Review production domain, email delivery, rate-limit configuration, and map credentials before launch.
