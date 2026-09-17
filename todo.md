# Nexshipping QA Checklist

## QA scope

- [x] Frontend and backend production builds
- [x] TypeScript validation
- [x] ESLint gate and formatting checks
- [x] Database connectivity and core table presence
- [x] Public route and tracking API smoke checks
- [x] Authentication cookie behavior and session validation review
- [x] Admin authorization and protected procedure review
- [x] Quote, contact, newsletter, and tracking input validation coverage
- [x] Shipment timeline and audit-log data-path review
- [x] Mobile responsive screenshot review
- [x] SEO, robots, sitemap, and environment configuration review
- [x] Production-mode error response probe

## Fixes applied

- [x] Use `SameSite=Lax` and `Secure=false` for local HTTP session cookies; retain secure cross-site cookies for HTTPS.
- [x] Reject session tokens with a missing or mismatched application ID.
- [x] Fail clearly when `JWT_SECRET` is missing instead of signing with an empty secret.
- [x] Add a real `pnpm lint` ESLint gate and clean the reported error/unused bindings.
- [x] Upgrade direct dependencies with high-severity advisories and patch the Express dependency chain through `.pnpmfile.cjs`.
- [x] Preserve the existing Wouter route-discovery patch in the lockfile and verify it is installed from a frozen lockfile.
- [x] Add contact and newsletter malformed-input regression tests.

## Residual caveats

- No authenticated OAuth browser session was available for submitting a real admin mutation or creating test PII in the shared database. Protected procedures, unauthenticated denial, and admin page rendering were verified without modifying production-like records.
- The production build reports a non-blocking large-client-chunk warning from the existing frontend bundle; this was not changed because it is a performance optimization rather than a correctness defect.
- The active sandbox pnpm 10.4.1 prints a warning about the legacy `pnpm.patchedDependencies` field; the committed lockfile and frozen-install check preserve and install the Wouter patch correctly.

## Final status

- [x] QA report written
- [x] Tests, audit, build, smoke, and formatting checks passed
- [x] Commit and GitHub push completed
- [x] WebDev checkpoint completed
