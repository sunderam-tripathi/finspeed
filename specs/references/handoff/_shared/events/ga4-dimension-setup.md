# GA4 Dimension Setup — REQ-001 Site Shell Analytics

## Purpose
Support frozen event contract `site.interaction.analytics.v1` by provisioning custom dimensions/metrics required for navigation, language, and theme analytics.

## Property
- GA4 Property: Finspeed Marketing (ID TBD)
- Data stream: Web — finspeed.online

## Custom Dimensions
| Dimension Name | Scope | Event Parameter | Description |
|----------------|-------|-----------------|-------------|
| CTA ID | Event | `cta_id` | Slug of CTA clicked (`dealers`, `compare`, `support_whatsapp`, etc.). |
| Navigation Position | Event | `position` | UI location emitting event (`top_nav`, `drawer`, `footer`, `hero`, `filter_panel`, `catalog_card`). |
| Theme | Event | `theme` | Theme in effect when interaction occurred (`light`, `dark`). |
| Consent Granted | Event | `consent_granted` | Boolean flag (`true`/`false`) indicating analytics consent at event time. |
| Filter ID | Event | `filter_id` | Catalog facet key applied (e.g., `frame`, `brakes`). |
| Filter Value | Event | `filter_value` | Selected values for the facet (stored as array, exposed as string). |
| Results Count | Event | `results_count` | Number of catalog results after applying filters. |
| Comparison Models | Event | `comparison_models` | Pipe-delimited list of model slugs active in comparison. |
| Removed Model | Event | `removed_model` | Model slug removed from comparison (if applicable). |

### Steps
1. Navigate to **Configure → Custom definitions → Custom dimensions**.
2. Create entries per the table (scope = Event).
3. Set parameter names exactly as specified; descriptions as above.
4. Publish changes; note it may take up to 24 hours for data to appear.

## Custom Metrics (Optional)
| Metric Name | Scope | Event Parameter | Type |
|-------------|-------|-----------------|------|
| Dealer CTA Clicks | Event | `event_name` filtered to `dealer_directions_click` | Count |
| Catalog Filter Applies | Event | `event_name` filtered to `catalog_filter_applied` | Count |
| Catalog Comparisons | Event | `event_name` filtered to `catalog_compare_opened` | Count |

## Measurement Protocol / gtag Wiring
- Ensure GA4 implementation sends parameters via `gtag('event', ...)` or Measurement Protocol with payload keys matching schema.
- Example:
  ```js
  gtag('event', 'dealer_directions_click', {
    locale: 'en',
    cta_id: 'dealers',
    position: 'drawer',
    theme: 'dark',
    consent_granted: true
  });
  ```

## Validation
- Use GA4 DebugView to confirm parameters appear under **Event parameters**.
- Cross-check against contract tests added by QA (AI-003) to ensure payload parity.

## Owners & Timeline
- Analytics Engineer to provision by 2025-11-08 (AI-002).
- QA Lead to confirm events appear with dimensions during acceptance testing.
