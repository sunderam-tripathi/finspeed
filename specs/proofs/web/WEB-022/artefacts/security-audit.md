# Security audit note

Audit date: 2026-07-13

- Critical findings: 0 after upgrading Next.js to `16.2.10`.
- High findings: 0 after direct and transitive dependency updates.
- Remaining findings: 2 moderate PostCSS advisories nested under Next.js `16.2.10`.
- Forced npm remediation rejected because it proposes a breaking downgrade to Next.js `9.3.3`.
- Follow-up: upgrade when a stable Next.js release contains the patched PostCSS dependency.
