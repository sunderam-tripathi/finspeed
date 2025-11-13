---
title: Finspeed E2E smoke scenarios
framework: Playwright
status: Draft
last_reviewed: 2024-04-27
---

## Tests

1. **TST-E2E-001 Home navigation + language toggle**
   - Visit `/`
   - Verify primary navigation renders links in frozen order and dealer CTA visible
   - Toggle to Hindi; confirm localized hero text and intercept `language_change` event
   - Toggle back to English and confirm nav copy reverts

2. **TST-E2E-002 Catalog category display**
   - Navigate to `/bicycles`
   - Confirm cards show factory-direct price, warranty/service/EMI messaging
   - Apply facet filters and confirm results update without full reload
   - Validate analytics payload `catalog_filter_applied` includes filter metadata

3. **TST-E2E-003 Model detail + dealer CTA**
   - Open Shark (Blue) detail page
   - Confirm specs, price, warranty/service/EMI copy
   - Click “Find at a dealer”; assert redirect with model context

4. **TST-E2E-004 Dealer locator directions**
   - Visit `/dealers`
   - Enter postal code `201306`
   - Trigger directions icon; intercept analytics event `dealer_directions_click`

5. **TST-E2E-005 Blog subscription**
   - Open blog article
   - Scroll to subscription form
   - Submit valid email; mock Formspree call; assert success confirmation

6. **TST-E2E-006 Support contact CTA**
   - Scroll to footer
   - Click WhatsApp link; ensure link format matches `https://wa.me/919650608982`
   - Verify analytics event `support_whatsapp_click`

7. **TST-E2E-007 Accessibility lint**
   - Run axe checks on home, catalog, dealer, story, and blog pages; fail on critical violations.
