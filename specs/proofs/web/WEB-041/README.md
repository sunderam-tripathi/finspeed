# WEB-041 Proof - Legal and policy pages

## Steward action required before gateway submission

The policy text is **drafted, not legally reviewed**. It commits the business
to specific terms — a 7-day return window, 48-hour transit-damage reporting,
5 working days to initiate refunds, 3-5 day dispatch and 3-7 day delivery, and
a five-year frame / twelve-month component warranty. Those figures were chosen
as reasonable defaults consistent with the distributor FAQ already in the
repository. **Confirm or amend each before submitting to Razorpay**, and add
the registered entity name, address and GSTIN, which the repository does not
contain and the pages therefore omit.

## What shipped

- `/privacy`, `/terms`, `/refunds`, `/shipping` — static server-rendered
  routes, each with its own title and description metadata, cross-linking the
  other three plus `/contact`.
- Deliberately rendered outside the design SPA: gateway reviewers, regulators
  and crawlers must be able to read them with JavaScript disabled, which the
  client-only SPA cannot guarantee. The trade-off is that they carry minimal
  branded chrome rather than the editorial header and footer.
- Light and dark styling via `prefers-color-scheme`.

## Verification

- Production build: all four routes listed as `○ (Static)` prerendered.
- `apps/web/tests/legal-pages.spec.ts`: **6/6** — per-route status, title,
  heading and content markers; a **JavaScript-disabled** pass over all four;
  and the cross-link set.
- Lint 0 errors (a `react/no-unescaped-entities` error found and fixed during
  development), typecheck clean, unit suite 30/30 unaffected.

## Follow-ups recorded

- Link `/privacy` from the consent banner (closes the WEB-036 follow-up) and
  from the storefront footer; both live inside the design SPA and are a
  separate, small slice.
- Commerce sequence continues per the roadmap: order persistence, then the
  Razorpay integration with server-side webhook verification.

final result: passed — pages live and tested; steward legal review outstanding
