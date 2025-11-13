# Contract — `site.interaction.analytics.v1`

Version: v1.0 | Owner: Analytics Engineer | Scope: GA4 Measurement API payload when consented events fire from the marketing site.

## Envelope
| Field | Type | Notes |
|-------|------|-------|
| `event_name` | enum (see list below) | Required; describes the interaction. |
| `event_time` | string (ISO 8601) | Required. Use browser time, then GA4 converts to UTC. |
| `locale` | enum `en`\|`hi` | Required; derived from IC-6 toggle. |
| `payload` | object | Include only properties relevant to the event; omit nulls. |

**Allowed `event_name` values**
```
dealer_directions_click, support_whatsapp_click, support_email_click,
blog_subscription_submit, language_change, primary_nav_click, theme_toggle,
catalog_filter_applied, catalog_compare_opened, catalog_compare_removed,
model_dealer_cta_click, model_gallery_interaction, model_specs_copy,
model_jsonld_validation_error, dealer_search_submitted, dealer_contact_action,
dealer_no_results, brand_timeline_scroll_depth, brand_metric_hover,
brand_cta_click, testimonial_slide_view, testimonial_autoplay_toggled,
testimonial_category_filter, blog_tag_filter, blog_article_read,
blog_subscription_banner, support_channel_click, support_faq_search,
support_incident_banner_view
```

## Payload schema (all optional unless noted)
| Field | Type / Enum | Description |
|-------|-------------|-------------|
| `dealer_id` | string | Dealer slug when a dealer element is clicked. |
| `model_slug` | string | Model identifier for detail page interactions. |
| `subscription_email_hash` | string | SHA-256 hash of visitor email (subscription/support forms). |
| `from_locale` / `to_locale` | enum `en`\|`hi` | Locales before/after language toggle. |
| `cta_id` | string | Contracted CTA identifier (`dealers`, `support_email`, `hero_cta`, ...). |
| `position` | enum `top_nav`\|`drawer`\|`footer`\|`hero`\|`filter_panel`\|`catalog_card` | Placement of CTA/navigation element. |
| `theme` | enum `light`\|`dark` | Theme reported for `theme_toggle`. |
| `consent_granted` | boolean | Must be true before any analytics hit is sent. |
| `filter_id` | string | Catalog facet key (`frame_material`, `brakes`, etc.). |
| `filter_value` | array[string] | Values selected for the facet. |
| `results_count` | integer ≥ 0 | Result count after search/filter. |
| `comparison_models` | array[string] | Current comparison drawer contents. |
| `removed_model` | string | Model removed from comparison. |
| `postal_code_prefix` | string | First 3–4 characters only (no full PIN). |
| `radius_km` | number ≥ 0 | Dealer search radius. |
| `filters` | array[string] | Additional applied filters/tags. |
| `channel` | string | Support/contact channel id (`whatsapp`, `email`, etc.). |
| `asset_type` | enum `image`\|`video`\|`360`\|`gallery` | Media type interacted with. |
| `frame_index` | integer ≥ 0 | Gallery frame index. |
| `section` | string | Page section (`specs`, `timeline`, `faq`, ...). |
| `error_code` | string | JSON-LD validation or UI error key. |
| `percent` / `read_percent` | enum 25\|50\|75\|100 | Scroll/read completion buckets. |
| `metric_id` | string | Brand metric tile id. |
| `target` | string | CTA destination (e.g., `dealers`, `support`). |
| `testimonial_id` | string | Testimonial content identifier. |
| `autoplay` | boolean | Testimonial autoplay state. |
| `enabled` | boolean | Toggle state (theme, autoplay, etc.). |
| `category` | string | Content category/tag for filters. |
| `tag` | string | Blog tag used. |
| `banner_id` | string | Support incident banner ID. |

## Consent & sequencing
1. Gate GA4 initialization behind consent manager; no events fire until consent captured.
2. Include `consent_granted` flag on every payload for auditability.
3. Blog/support forms must hash emails client-side before sending `subscription_email_hash`.

## QA expectations
- Playwright suites send fixture payloads through GA4 DebugView and assert schema compliance.
- Contract schema (`../_shared/events/site.interaction.analytics.v1.json`) lint runs in CI.
- Manual spot-check prior to release: verify `consent_granted` prevents events when declined.
