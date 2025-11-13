# Event Catalog — Finspeed Marketing Site

All analytics events share the frozen schema `site.interaction.analytics.v1` (`../_shared/events/site.interaction.analytics.v1.json`) and are emitted only after consent. Refer to the detailed contract in `../_shared/contracts/site-interaction-ga4.md`. Idempotency key combines `event_name`, `event_time`, and contextual identifiers (CTA/filter/model IDs).

| Event names | Trigger | Slice / Requirement | Key payload fields | Notes |
|-------------|---------|---------------------|--------------------|-------|
| `dealer_directions_click`, `primary_nav_click`, `language_change`, `theme_toggle` | Navigation interactions on site shell | REQ-001 Site Structure | `cta_id`, `position`, `from_locale`, `to_locale`, `theme`, `consent_granted` | Ensures dealer CTA visibility, locale tracking, theme adoption. |
| `catalog_filter_applied`, `catalog_compare_opened`, `catalog_compare_removed` | Catalog listing filtering & comparison drawer | REQ-002 Product Catalog | `filter_id`, `filter_value`, `results_count`, `comparison_models`, `removed_model` | Drives funnel analysis and load testing budgets. |
| `model_dealer_cta_click`, `model_gallery_interaction`, `model_specs_copy`, `model_jsonld_validation_error` | Model detail interactions | REQ-003 Model Detail | `model_slug`, `cta_id`, `asset_type`, `section`, `error_code` | Supports gallery usage analytics and schema validation monitoring. |
| `dealer_search_submitted`, `dealer_contact_action`, `dealer_no_results` | Dealer locator search/map actions | REQ-004 Dealer Locator | `postal_code_prefix`, `radius_km`, `channel`, `filters` | Enables measuring dealer availability and search gaps. |
| `brand_timeline_scroll_depth`, `brand_metric_hover`, `brand_cta_click` | Brand story engagement | REQ-005 Brand Story | `percent`, `metric_id`, `target` | Tracks storytelling effectiveness and CTA performance. |
| `testimonial_slide_view`, `testimonial_autoplay_toggled`, `testimonial_category_filter` | Testimonials carousel usage | REQ-006 Testimonials | `testimonial_id`, `autoplay`, `category` | Monitors content preference and accessibility compliance. |
| `blog_tag_filter`, `blog_article_read`, `blog_subscription_submit`, `blog_subscription_banner` | Blog browsing & subscription flows | REQ-007 Blog | `tag`, `read_percent`, `subscription_email_hash`, `consent_granted` | Hashes email before send; informs content strategy. |
| `support_channel_click`, `support_whatsapp_click`, `support_email_click`, `support_faq_search`, `support_incident_banner_view` | Support hub interactions | REQ-008 Support Hub | `channel`, `cta_id`, `filters`, `banner_id` | Validates support channel usage and incident comms reach. |

## Publishing & Delivery
- Events delivered via GA4 Measurement Protocol (`gtag`) once consent granted.
- Contract tests (Playwright + GA4 DebugView) validate payloads—see `../_shared/tests/test-plan.md`.
- GA4 custom dimensions mapped per `../_shared/events/ga4-dimension-setup.md`.
