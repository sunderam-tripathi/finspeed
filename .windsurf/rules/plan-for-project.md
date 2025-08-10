---
trigger: model_decision
description: The project timeline and planning for daily task management
---

# Finspeed Build & Launch Plan (v1.0)

**Goal**  
Fast, reliable MVP e-commerce for cycles in India; scalable baseline.

---

## Stack Snapshot  
- **FE**: Next.js (App Router), Tailwind, SSR/ISR  
- **API**: Go, Postgres (migrations)  
- **Infra**: GCP — Cloud Run, Cloud SQL, Secret Manager, Monitoring  
- **CI/CD**: GitHub Actions — `develop` → staging, `main` → prod  
- **Payments (v1.0)**: Stripe cards (test → live)  

---

## Out-of-Scope (v1.0)  
Marketplaces, multi-seller, mobile apps, subscriptions, loyalty, advanced search.

---

## Timeline & Key Phases  
| Phase | Date | Focus | Milestone |
|-------|------|-------|-----------|
| 1. Foundation | 4–12 Aug | Repo, DNS/SSL, email, local dev | — |
| 2. Pipeline & Infra | 13–22 Aug | Cloud SQL, staging CI, monitoring | Demo #1 (22 Aug) |
| 3. Backend Features | 25 Aug–12 Sep | Auth, products, cart, orders, Stripe, email | Demo #2 (5 Sep) |
| 4. Frontend & UX | 8 Sep–3 Oct | UI, checkout, SEO, analytics, admin | Demo #4 (3 Oct) |
| 5. Harden & Prod Setup | 6–15 Oct | E2E, performance, security, runbooks | — |
| 6. Production Launch | 16–17 Oct | Go-live, smoke tests, rollback ready | Launch (17 Oct) |
| 7. Hyper-care | 18–31 Oct | Triage, analytics, SEO, cost tuning | — |

---

## MVP Capabilities  
- Browse products → cart → live payment → email  
- Admin product CRUD  
- Basic SLOs (p95 <350 ms, 99.9% uptime)  
- Backups with restore drill, rollback tested  
- Policy pages, cookie consent

---

## Architecture (summary)  
FE ↔ API ↔ Cloud SQL; secrets in Secret Manager; infra via CI; observability via dashboards & uptime checks.

---

## Data Model (summary)  
`users`, `products`, `product_images`, `categories`, `carts`, `cart_items`, `orders`, `order_items`, `payments`, `audit_logs`.

---

## Acceptance Criteria  
- Purchase flow works end-to-end live  
- Admin UX functional  
- No P1s unresolved >4h; SLOs met for 14 days  
- Backup + restore tested; rollback validated  
- Email, consent, policy compliance live

---

## v1.1 Enhancements  
UPI, COD, wishlists, reviews, rich search, tracking, promotions, PWA.

