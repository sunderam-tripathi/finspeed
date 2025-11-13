# Frozen Contracts — SCN-008

| Contract | Purpose | Notes |
|----------|---------|-------|
| IC-16-support-hub.md | Defines support hub layout, channel tiles, FAQ search, analytics | Mirrors `61-interfaces/ui-forms/support-hub.md`; Frozen v1.0. |
| IC-7-formspree-submission.md | Support fallback form submission contract | Shared with blog; ensures hashed email + consent gating before Formspree POST. |
| support-channels.schema.json | Validates CONTACT-001 config (emails, WhatsApp link, SLA) | Run YAML→JSON validation in CI before deploy. |
| faq-entry.schema.json | Validates FAQ-001 content structure | Ensures topics/questions meet length limits; powers FAQ search index. |
