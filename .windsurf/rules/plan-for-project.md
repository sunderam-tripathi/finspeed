---
trigger: always_on
description: The project plan
---

# Finspeed — Build & Launch Plan (Concise, No Timeline/Dates)

**Owner:** You  
**Goal:** Launch a fast, reliable e‑commerce site for cycles & accessories in India with an MVP + scale foundations.  
**Stack:** Next.js (App Router + Tailwind, SSR/ISR), Go API + Postgres (Cloud SQL), GCP Cloud Run, GitHub Actions CI/CD.  
**MVP Payments:** Stripe (test → live), then UPI/COD in v1.1.  
**Non‑negotiables:** HTTPS, Secret Manager, backups + restore drill, uptime checks, WAF/rate‑limit, SEO/a11y, policy pages, rollback.

> **Out of scope v1.0:** Marketplace/multi‑seller, complex loyalty, multi‑warehouse, subscriptions, mobile apps.

---

## 1) Roles & RACI
- **Product/Tech Lead:** You (R/A)  
- **Reviewer:** Trusted friend (C)  
- **Stakeholders:** Early customers (I)

---

## 2) Environments, Branching & URLs
- **Branches:** `main` (prod), `develop` (staging); PR‑only; branch protections.  
- **Staging:** `staging.finspeed.in`, `api.staging.finspeed.in`  
- **Prod:** `www.finspeed.in` (HTTPS + HSTS), `api.finspeed.in`  
- **Certs:** Managed TLS; prefer apex primary.

---

## 3) Repository Layout
```
finspeed/
  .github/workflows/{deploy-staging.yml, deploy-production.yml}
  infra/terraform/{main.tf, variables.tf, outputs.tf, cloudsql.tf, cloudrun_frontend.tf, cloudrun_api.tf, secrets.tf, monitoring.tf, budget_alerts.tf}
  frontend/{src, public, package.json, next.config.js, middleware.ts}
  api/{cmd/server/main.go, internal, go.mod}
  db/{migrations, seed}
  docker/{frontend.Dockerfile, api.Dockerfile}
  docker-compose.yml
  Makefile
  README.md
```
**Makefile (baseline):** `make dev | test | lint | migrate-up | migrate-down | seed | e2e | build`

---

## 4) Environment Variables & Secrets (contract)
`DATABASE_URL`, `DB_MAX_CONNS`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `WEB_BASE_URL`, `NEXT_PUBLIC_API_URL`, `EMAIL_PROVIDER_API_KEY`, `SESSION_COOKIE_DOMAIN`, `LOG_LEVEL`, `ALLOWED_ORIGINS`.  
**Rules:** All secrets in **GCP Secret Manager**, never in repo. Per‑service SAs (least privilege). Rotation policy (quarterly or on role change).

---

## 5) Workstreams & Checklists (Phases; no dates)

### A) Foundation
- **Repo/Workflow:** Monorepo; PR/Issue templates; CODEOWNERS; Dependabot/SCA; Go vuln check; `npm audit`.  
- **Domain/DNS/SSL/Email:** Cloud DNS (staging/prod); managed certs; force HTTPS + HSTS; email provider sandbox; DKIM/SPF/DMARC.  
- **Brand/Content/Legal:** Tailwind tokens; policy pages (Privacy, Terms, Returns/Refunds, Shipping, Cookies); content inventory (home, categories, 20 product blurbs, size/fit, assembly/maintenance).  
- **Local Dev/Data:** `docker-compose` for FE/API/Postgres with hot reload; DB seed (3 cats, 20 products, admin, test customer/order); `/healthz` on API/FE.  
- **Security/IAM:** Secret Manager; per‑service SAs; SQL via private IP; Cloud Run behind LB; rotation cadence documented.  
- **DoD:** One‑command local up; unit tests run; DNS/SSL ready; email sandbox delivers to verified address.

### B) DB, Security & Staging CI
- **Database:** Migration tool; Cloud SQL (staging) with private IP + TLS; daily backups + PITR; **restore test performed**.  
- **CI→Staging:** On push to `develop`: build images → deploy FE/API to Cloud Run → run migrations → smoke tests; idempotent seed job.  
- **Observability/Budgets:** Dashboards (p95, 5xx, CPU/RAM, DB conns); uptime checks for `/healthz`; alerts (email/Slack); budget alerts at 60/80/90%.  
- **Security:** Basic WAF & rate‑limit; strict CORS; DB not public; staging min instances = 0.  
- **QA/Docs:** Test plan; decision log; ADRs.

### C) Backend Sprints
- **Contracts:** OpenAPI 3; publish `/openapi.json`; generate FE client types.  
- **Auth/Users:** Email/password; bcrypt/argon2; JWT access+refresh with rotation & revoke list; RBAC (`admin`, `customer`); audit log.  
- **Catalogue:** Product & Category CRUD; pagination/sort/filter; images (primary/alt); inventory (`stock_qty`, `sku`, `hsn`, `warranty_months`).  
- **Cart/Orders:** Idempotent add/remove; merge guest→user; order state machine; shipping model (address, pincode, fee rules).  
- **Payments:** Stripe (test): webhook sig verify; idempotency keys; persist records; finalize order on `payment_intent.succeeded`; email confirmations/failures.  
- **Admin Console:** Auth; product CRUD; inventory adjustments; order status updates; payment reconciliation view.

### D) Frontend Sprints
- **UI:** Tailwind tokens; responsive grid; base components; pages (Home, Category, PDP, Cart, Checkout, Auth, Orders, Admin).  
- **UX:** Loading/empty/error states; PDP gallery zoom/specs/size guide/assembly notes; faceted filters; simple search; pincode check (placeholder rules).  
- **SEO/Perf:** Titles/meta/OG/Twitter; canonical; sitemap/robots; schema.org Product/Offer; perf budgets (LCP ≤ 2.5s 4G, JS ≤ 180 kB gz, CLS ≤ 0.1); 404/500.  
- **A11y:** Keyboard/focus/ARIA; contrast AA+.  
- **Analytics/Consent:** Page/product/cart/checkout/purchase events; cookie banner + consent log.  
- **Cross‑browser/device:** Chrome/Edge/Safari + Android/iOS quick tests.

### E) Test, Hardening & Prod CI
- **E2E/Load:** Cypress flows (browse→PDP→cart→checkout, auth, admin CRUD); k6 50 RPS; API p95 < 350 ms; FE LCP budget met (throttled).  
- **Security:** DAST (ZAP/OWASP) for XSS/CSRF/IDOR/SSRF/SQLi; secure headers (CSP, HSTS, X‑Frame‑Options, Referrer‑Policy, Permissions‑Policy); CSRF where needed; strict CORS; cookies `Secure` + `HttpOnly`.  
- **Runbooks/CI:** Deploy, rollback (previous Cloud Run rev), incident guide/on‑call; prod CI gated by tests + security, manual approval, release notes.  
- **Data Protection:** Verify backups; **staging restore drill**; document RTO ≤ 2h, RPO ≤ 24h.  
- **Legal:** Policy pages; cookie banner behavior; DPDP‑style data requests process.  
- **Freeze:** Migrations/content freeze except P0s.

### F) Launch & Hyper‑care (process only)
- **Launch:** Pre‑launch DB snapshot; merge `develop`→`main`; prod deploy + migrations; switch live payment keys; place a real test order; smoke + SLO watch; rollback if P1s.  
- **Hyper‑care:** Daily triage; SEO & Core Web Vitals; cost tuning; rollback + DB restore drills; seed v1.1 (UPI, wishlists, reviews, search, email templates).

---

## 6) Product & Ops (Cycles, India)
- **PDP:** ≥1200px images; zoom; size/fit charts; specs; warranty; assembly/maintenance; accessories cross‑sell.  
- **Checkout:** Address validation (basic); serviceable pincode flag; fee logic; ETA; GST invoice (name/GSTIN); order notes.  
- **Payments:** v1.0 Stripe cards; v1.1 add UPI (Stripe/local PSP) and evaluate COD (limits/OTP/address verify).  
- **Shipping/Returns:** Courier choice; packaging; bike box specs; fragile labels; returns window 7–10d; restocking rules; DOA handling; RMA email template.  
- **Tax/Compliance:** GST invoices + HSN; DPDP‑aligned privacy & data‑subject steps.  
- **Support:** Contact (email/phone/WhatsApp); basic order tracking (status + AWB).

---

## 7) Architecture (Text Overview)
FE (Cloud Run) → API (Cloud Run) → Cloud SQL (Postgres). Secrets via Secret Manager; private VPC to DB; CDN/HTTP caching for images & static assets; images in GCS with signed URLs. CI builds & deploys containers; migrations as job/entrypoint; release notes per prod deploy.

---

## 8) Data Model (MVP)
`users`, `products`, `product_images`, `categories`, `carts`, `cart_items`, `orders`, `order_items`, `payments`, `audit_logs` with fields as previously specified (ids, slugs, hashes, amounts in INR, JSON for address/metadata, timestamps).

---

## 9) API Surface (sample)
- **Auth:** `POST /v1/auth/register`, `POST /v1/auth/login`, `POST /v1/auth/refresh`, `POST /v1/auth/logout`  
- **Catalogue:** `GET /v1/products`, `GET /v1/products/:slug`, `GET /v1/categories`  
- **Cart:** `GET/POST/DELETE /v1/cart*` (idempotent ops)  
- **Orders:** `POST /v1/orders`, `GET /v1/orders/:id`  
- **Payments (Stripe):** `POST /v1/payments/stripe/intent`, `POST /v1/payments/stripe/webhook`  
- **Admin:** `/v1/admin/*` (RBAC + audit).  
- **OpenAPI:** `/openapi.json` published; FE client types generated.

---

## 10) Testing Strategy
Unit (Go/React); integration (API+Postgres; FE→API contracts); E2E (Cypress flows); load (k6 50 RPS); security (SCA/DAST + manual authZ/IDOR); performance (Lighthouse budgets in CI).

---

## 11) Observability & SLOs
**SLOs (prod):** API p95 < 350 ms; 99.9% availability; 5xx < 0.5%.  
**Dashboards:** Latency, errors, CPU/RAM, DB conns (and queue if any).  
**Alerts:** Uptime, high 5xx, budget thresholds, unusual spend spikes, DB storage > 80%.

---

## 12) Runbooks (excerpts)
**Staging deploy:** push to `develop` → CI → deploy → migrate → seed → smoke.  
**Prod deploy:** PR → merge to `main` → manual approval → deploy → smoke.  
**Rollback:** Restore previous Cloud Run revision → log incident → hotfix.  
**Incident/P1:** Acknowledge → comms → mitigation/rollback → post‑mortem ≤ 48h.  
**Access:** Onboard/offboard SA keys; rotate on role change or suspicion.

---

## 13) Risks & Mitigations
Payment failures (retry paths, support, reconcile cron); inventory mismatch (server‑side checks, transactional updates, back‑order guard); shipping issues (RMA/photos/serials, DOA window, restocking fees); perf spikes (autoscale, ISR, image opt, caching, budgets in CI); cost overruns (budgets, min instances=0, right‑size DB, monthly review); solo‑builder risk (docs, runbooks, restore drills, ADRs).

---

## 14) Acceptance Criteria (v1.0)
Customer can **browse → add to cart → pay (live) → receive email**; Admin can **CRUD products** with storefront reflection; SLOs met 14d; no unresolved P1 > 4h; policy pages + cookie consent live; emails DKIM‑signed; backups configured and **restore drill** passed; rollback to previous revision tested.

---

## 15) v1.1 Backlog (post‑launch)
UPI; COD (guardrails: value cap/OTP/address verify); wishlists; reviews/ratings; better search/compare/“find your fit”; serviceability API + courier webhooks; promos/coupons; richer emails; PWA/offline cart (nice‑to‑have).

---

## 16) One‑Time Admin Checklist
GCP billing + budgets; GitHub→GCP OIDC (no long‑lived keys); Stripe (test in staging; live only prod); email domain verified (DKIM/SPF/DMARC pass); support channels listed on Contact; privacy email alias live.

---

## 17) Final Quality Gate
Close P0/P1; no open P1/P2 security; perf budgets & Core Web Vitals “Good”; live purchase verified (small capture/refund); runbook dry‑run & rollback test same day; backup + restore within RTO; policy pages/cookie banner verified; analytics events validated end‑to‑end.

## 18) Important notes -
Ask me to do actions in GCP console and GIthub and check things to resolve issues. A lot of issues cannot be resolved from the local development environment. Be proactive, I will always help you with all informations I can assemble.
