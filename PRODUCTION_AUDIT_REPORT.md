# Nexshipping Production-Readiness Audit Report

**Application:** Nexshipping Global Logistics

**Audit date:** 17 September 2026

**Scope:** Frontend, backend, database, authentication, authorization, shipment tracking, quote and contact workflows, customer and admin portals, API behavior, maps and notification integrations, mobile responsiveness, accessibility, SEO, performance, security, error handling, environment configuration, migrations, and production build/runtime behavior.

## Executive conclusion

The audit identified and remediated multiple production-impacting defects. The audited source now passes TypeScript validation, ESLint, the complete Vitest suite, route/API/crawler smoke checks, the optimized production build, and compiled production runtime probes when valid production configuration is supplied. The application is **not yet eligible for an unqualified production-ready claim in the active environment** because the current `JWT_SECRET` is shorter than the enforced 32-character minimum. The server correctly refuses to start in that state. A strong secret must be provisioned before deployment.

The audit also found external operational work that cannot be completed from this sandbox: credential rotation, DNS and canonical-domain verification, Google Maps quota/restriction verification, and end-to-end delivery testing through the external notification/provider consoles. Direct customer-facing transactional email is not configured; quote and contact submissions now attempt owner notification through the configured Manus notification service and return an explicit delivery flag.

## Tests performed and results

| Test or inspection | Result | Evidence |
|---|---:|---|
| TypeScript compiler | Passed | `pnpm check` completed with exit code 0. |
| ESLint | Passed | `pnpm lint` completed with zero errors and zero warnings. |
| Vitest | Passed | 2 test files, 15 tests passed. |
| Public/private route smoke checks | Passed | `/`, `/about`, `/services`, `/tracking`, `/quote`, `/contact`, `/faq`, `/news`, `/privacy`, `/terms`, `/login`, `/dashboard`, and `/admin` returned 200. |
| Health and readiness probes | Passed | `/health`, `/healthz`, and `/readyz` returned JSON health responses in the live preview; compiled production runtime returned 200 with valid configuration. |
| Tracking API smoke check | Passed | Unknown tracking number returned a successful null response rather than fabricated data. |
| Crawler files | Passed | `robots.txt` and `sitemap.xml` returned 200; sitemap URLs are absolute canonical URLs. |
| Production build | Passed | `pnpm build` completed successfully. The largest remaining JavaScript chunk is approximately 482 kB, 145 kB gzip, after vendor splitting. |
| Compiled production runtime with valid temporary secret | Passed | Server started on port 3101; health, readiness, root response, security headers, and production CSP were verified. |
| Compiled production runtime with active environment | Blocked as intended | Startup failed closed with `JWT_SECRET must be at least 32 characters in production.` |
| Responsive visual review | Passed for captured viewports | Mobile screenshots covered the homepage, tracking, news index/detail, login, customer dashboard, and admin portal at 375x812. |
| Authenticated end-user OAuth mutation flow | Not fully executed | No production OAuth browser session was used to create or modify shared PII records. Protected routes and denial paths were tested without modifying shared records. |

## Issues discovered and fixes applied

| Area | Issue and root cause | Remediation | Verification |
|---|---|---|---|
| Public tracking privacy | Tracking lookup returned the full shipment row and full event rows, including customer ownership data. | Replaced the response with an explicit public projection containing only operational tracking fields. | TypeScript, Vitest, tracking smoke check, and source review passed. |
| Customer data ownership | Customer dashboard relied primarily on mutable email equality, allowing email changes to alter access scope. | Added immutable `customerOpenId` columns and indexes to shipments and quotes; dashboard queries use the signed-in open ID and only fall back to email for legacy rows without an owner ID. | Migration applied successfully; TypeScript and tests passed. |
| Admin mutation correctness | Update and delete operations returned success for nonexistent IDs. Event creation could create an orphan event because existence was not checked atomically. | Added affected-row checks, `NOT_FOUND` errors, non-empty update validation, and a transaction that verifies the shipment before inserting an event and updating its status. | New regression tests passed, including missing quote/contact/shipment checks. |
| Audit-log integrity | Delete audit records could be written before a delete that later failed, creating misleading history. | Deletion now verifies and completes the delete before writing the audit entry. | Regression test and source review passed. |
| Quote/contact operations | Submissions persisted but did not notify the project owner, and upstream notification could hang. | Added owner notification attempts after persistence, explicit `notificationDelivered` response state, and a five-second upstream timeout. | TypeScript, tests, and live API path review passed; provider delivery still requires external-console verification. |
| Health checks | `/health` was handled by the SPA fallback instead of returning a health response. | Added `/health` and `/healthz` JSON endpoints and a database-backed `/readyz` endpoint. | Live preview and compiled production runtime probes passed. |
| Environment failures | Missing or weak production configuration failed late or allowed unsafe startup assumptions. | Added fail-closed production validation for database, JWT, OAuth, owner identity, and built-in Forge credentials; enforced a minimum 32-character JWT secret. | Compiled runtime correctly failed with the active weak secret and passed with a temporary strong secret. |
| Session security | Sessions used a one-year lifetime and secure cookies used `SameSite=None`. | Reduced default session lifetime to 30 days and changed session/state cookies to `SameSite=Lax`, preserving secure transport behavior. | Logout cookie regression test passed; source review completed. |
| Request security | No explicit CSRF origin check, security headers, body-size limit, or API rate limit was present. | Added same-origin checks for non-GET tRPC requests, security headers, production CSP, one-megabyte body limits, per-IP limits, stricter limits for public form mutations, and bounded limiter memory. | Header probes, production runtime probe, TypeScript, lint, and smoke checks passed. The in-process limiter remains a defense-in-depth layer for multi-instance deployments. |
| Storage proxy | Arbitrary path-like storage keys were accepted by the proxy. | Added key validation rejecting absolute paths, traversal markers, and unsafe characters. | TypeScript and build passed. |
| Maps integration | Concurrent map consumers could inject duplicate scripts, and script failure left callers waiting indefinitely. | Added a shared loader promise and explicit rejection/cleanup on load failure. | TypeScript/build passed; provider quota and key restrictions remain external verification items. |
| News navigation | News cards linked to `/news/:slug`, but no detail route existed. | Added a published-post-by-slug procedure, a route, loading/error/not-found states, and safe text rendering for post content. | Route smoke and mobile screenshot review passed. |
| Mobile admin navigation | The fixed desktop sidebar was hidden on small screens with no equivalent section navigation. | Added a keyboard-accessible mobile section select. | Mobile screenshot review passed. |
| Accessibility | Several visible labels were not associated with controls; FAQ buttons lacked disclosure state; tracking input lacked validation feedback. | Added `htmlFor`/`id` associations, autocomplete hints, FAQ `aria-expanded`/`aria-controls`, tracking validation and alert messaging, and mobile menu semantics with Escape handling. | TypeScript/build and mobile visual review passed. |
| SEO and crawler behavior | Sitemap and robots used relative URLs; route metadata was mostly static; private routes could be crawled. | Added absolute canonical URLs, route-aware title/description/robots metadata, Open Graph updates, and robots exclusions for `/admin`, `/dashboard`, and `/login`. | Smoke checks and source review passed. The canonical domain must be confirmed before launch. |
| Performance | The shared application chunk exceeded the Vite warning threshold. | Added stable React, data, and UI vendor chunks in Vite configuration. | Production build passed; largest remaining application chunk reduced to approximately 482 kB, 145 kB gzip. |
| Package hygiene | pnpm warned that package-level `pnpm.patchedDependencies` was obsolete. | Removed the obsolete package-level field; workspace configuration remains authoritative. | `pnpm lint`, checks, and build passed without the prior warning. |

## Database changes

The schema now includes nullable `customerOpenId varchar(64)` columns on `shipments` and `quotes`, plus indexes named `shipments_customer_open_id_idx` and `quotes_customer_open_id_idx`. The generated additive migration is `drizzle/0003_first_chamber.sql`, accompanied by its Drizzle snapshot and journal update. The migration was applied successfully to the active WebDev database. No destructive `DROP` or data-losing alteration was introduced.

Existing rows remain compatible because the ownership columns are nullable. Legacy dashboard access falls back to the existing email only when the new immutable ownership field is null. New quote submissions associate the signed-in open ID when available; admin-created shipments continue to accept a customer email but cannot accept an arbitrary customer open ID from client input.

## API changes

The public tracking procedure now returns an allowlisted operational DTO rather than database rows. The public content router now exposes `publicContent.postBySlug({ slug })` for published insight detail pages. The customer dashboard procedure scopes results by authenticated user identity. Quote and contact mutation responses now include `notificationDelivered` in addition to the persisted request ID and success state.

Admin update, delete, and event procedures now return `NOT_FOUND` for missing records instead of false success. Empty shipment update payloads are rejected before database work. The new `/health`, `/healthz`, and `/readyz` endpoints are Express operational endpoints rather than tRPC procedures.

## Security fixes

The server disables the Express `X-Powered-By` header, sets `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS on HTTPS, and a production Content Security Policy. Non-GET tRPC requests with an `Origin` header must match the request origin. API requests receive an in-process per-IP limit, while quote/contact/newsletter mutations receive a stricter limit. Request bodies are limited to one megabyte.

Production startup requires `JWT_SECRET` of at least 32 characters, a database URL, OAuth application/server configuration, owner identity, and built-in Forge credentials. Session and OAuth state cookies use `HttpOnly`/`Secure` as appropriate and `SameSite=Lax`; session lifetime is 30 days. Storage proxy keys are validated before signed-URL retrieval.

These protections do not replace edge controls. A production deployment should still use a managed WAF/rate limiter, rotate any previously exposed credentials, restrict Google Maps keys by origin/API, and monitor notification failures.

## Files changed

The audited change set includes the following source, migration, verification, and documentation files:

| Group | Files |
|---|---|
| Frontend and SEO | `client/index.html`, `client/public/robots.txt`, `client/public/sitemap.xml`, `client/src/App.tsx`, `client/src/components/Map.tsx`, `client/src/components/SiteLayout.tsx`, `client/src/const.ts`, `client/src/pages/AdminPage.tsx`, `client/src/pages/ContentPages.tsx`, `client/src/pages/CustomerDashboardPage.tsx`, `client/src/pages/LoginPage.tsx`, `client/src/pages/QuotePage.tsx`, `client/src/pages/TrackPage.tsx` |
| Backend and security | `server/_core/cookies.ts`, `server/_core/env.ts`, `server/_core/index.ts`, `server/_core/notification.ts`, `server/_core/oauth.ts`, `server/_core/sdk.ts`, `server/_core/storageProxy.ts`, `server/db.ts`, `server/routers.ts` |
| Database and shared policy | `drizzle/schema.ts`, `drizzle/0003_first_chamber.sql`, `drizzle/meta/0003_snapshot.json`, `drizzle/meta/_journal.json`, `shared/const.ts` |
| Tests and tooling | `server/auth.logout.test.ts`, `server/nexshipping.test.ts`, `scripts/smoke-check.mjs`, `vite.config.ts`, `package.json` |
| Audit documentation | `todo.md`, `audit-visual-findings.txt`, `PRODUCTION_AUDIT_REPORT.md` |

## Required environment variables

The following variables are required for a production deployment:

| Variable | Requirement | Purpose |
|---|---|---|
| `DATABASE_URL` | Required | MySQL/TiDB application database. |
| `JWT_SECRET` | Required; at least 32 characters | Session signing secret. Rotate any prior weak or exposed value. |
| `VITE_APP_ID` | Required | OAuth application/project ID, used by server and client build. |
| `OAUTH_SERVER_URL` | Required; absolute URL | OAuth token and user-information service base URL. |
| `OWNER_OPEN_ID` | Required | Identifies the owner/admin account. |
| `BUILT_IN_FORGE_API_URL` | Required | Storage proxy and owner notification service base URL. |
| `BUILT_IN_FORGE_API_KEY` | Required | Server-side Forge authorization token. |
| `VITE_OAUTH_PORTAL_URL` | Required at client build time | Browser OAuth portal URL. |
| `VITE_FRONTEND_FORGE_API_URL` | Required at client build time for maps | Browser-side Forge maps proxy base URL. |
| `VITE_FRONTEND_FORGE_API_KEY` | Required at client build time for maps | Browser-side maps proxy key, restricted by the provider where possible. |
| `PORT` | Optional; platform normally supplies it | HTTP listener port; production binds exactly to it. |
| `NODE_ENV` | Set to `production` | Enables production static serving, validation, CSP, and runtime behavior. |
| `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID` | Optional | Umami analytics script configuration. |

The code currently uses `https://nexshipping.com` for canonical metadata, sitemap, and robots URLs. If the actual launch domain differs, update those values before publication and verify DNS/TLS.

## Deployment instructions

First provision the required production environment variables and replace the active weak JWT secret with a randomly generated secret of at least 32 characters. Then install dependencies from the lockfile with `pnpm install --frozen-lockfile`, apply committed migrations with `pnpm drizzle-kit migrate`, and build with `pnpm build`.

Run the service with `NODE_ENV=production pnpm start` under the platform-provided `PORT`. Configure the platform health probe to use `/healthz` and the readiness probe to use `/readyz`. A successful readiness response means the database connectivity probe succeeded. After deployment, verify `/healthz`, `/readyz`, `/robots.txt`, `/sitemap.xml`, and the public tracking lookup. Confirm that the external notification service accepts a test owner notification and that Google Maps loads only from approved origins.

For production operations, configure edge/WAF rate limiting, centralized logs and alerts, database backups, credential rotation, TLS, DNS, and a transactional email provider if customer confirmations are required. Do not use the preview auto-login behavior as a substitute for a real OAuth browser test in the production domain.

## Remaining issues and required follow-up

The active environment’s short JWT secret is a deployment blocker by design. Direct customer-facing email is not implemented; only owner notifications are attempted. Provider delivery, Maps quota/restriction settings, DNS, TLS, and credential rotation remain external operational checks. The in-process limiter is not a substitute for distributed edge enforcement. A final authenticated end-to-end test should be run after provisioning valid production credentials, using a designated non-production test account and records rather than shared production-like PII.

## Commit and checkpoint identifiers

The audited source, migration, tests, tooling, and report were committed and pushed to GitHub in commit [`a8eea44`](https://github.com/anyanwuvictornnaemeka1-bot/nexshipping/commit/a8eea44). The final WebDev checkpoint version is recorded here after the checkpoint operation completes.
