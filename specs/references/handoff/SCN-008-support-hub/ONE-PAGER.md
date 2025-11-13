# SCN-008 / REQ-008 — Support hub & contact channels

## Outcome (why)
Provide a single place for visitors to access Finspeed support, understand SLAs, and choose the right channel while capturing engagement analytics.

## Scope (this slice)
- In: Contact tiles (WhatsApp, email, phone, dealer), FAQ search, incident banner, Formspree fallback form, analytics.
- Out: CRM ticket integration, live chat, auth-gated support portal.

## Interfaces (this slice only)
| ID   | Type | Purpose | Contract path | Version | Example |
|------|------|---------|---------------|---------|---------|
| IC-16 | ui | Support hub experience with channel tiles & FAQ search | contracts/IC-16-support-hub.md | v1.0 | WhatsApp CTA deep links with templated message |
| IC-7 | http | Support form submission via Formspree | contracts/IC-7-formspree-submission.md | v1 | POST hashed email + message to Formspree |

## Acceptance checks
```gherkin
Scenario: Support email link exposes SLA + opens mail client
Scenario: WhatsApp CTA deep links with prefilled message and logs analytics
Scenario: FAQ search filters results and highlights matches
Scenario: Incident banner appears when status feed flag set
Scenario: Contact form falls back when WhatsApp disabled
```

## Non-functional & security
- Channel tiles load under 1s, CTA deep links gated by consent, incident banner refreshes every 5 minutes.
- No customer PII stored beyond consented form submissions (hashed email before analytics); WhatsApp link only uses template text.
- Logging captures channel_id and locale only; support form sanitized server-side by Formspree.

## Rollout/rollback
- Rollout: Validate CONTACT-001 + FAQ-001 schemas, update runbook, enable `supportHub.enable` flag, deploy static build.
- Rollback: Disable flag and route `/support` to contact email anchor; purge CDN caches for support assets.

## Links
- RFC (Accepted): 40-decisions/RFC-001-site-architecture.md
- Traceability: traceability/requirements-to-design.md (REQ-008 row)
- Design tag: contents of `TAG.txt`
