---
id: IC-7
title: Formspree subscription submission
status: Draft
owner: Frontend Team
last_reviewed: 2024-04-27
---

### Endpoint
- Method: `POST`
- URL: `https://formspree.io/f/finspeed-newsletter`
- Headers: `Content-Type: application/json`

### Request body
```json
{
  "email": "user@example.com",
  "locale": "en",
  "page": "/blog/daily-commute-cycling-safety"
}
```

### Response
- `200 OK` with `{ "ok": true }` when accepted.
- `400 Bad Request` when validation fails.
- `429 Too Many Requests` if quota exceeded.

### Notes
- Email validated client-side before submission.
- Hash email for analytics payload before sending GA4 event.
- Monitor free-tier limit (50 submissions/month) per `20-requirements/data/subscription-config.yaml`.
