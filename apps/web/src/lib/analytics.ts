type EventName =
  | 'dealer_search_submitted'
  | 'dealer_directions_click'
  | 'dealer_contact_action'
  | 'dealer_map_pin_select'
  | 'dealer_no_results'
  | 'dealer_locator_outage'
  | 'brand_cta_click'
  | 'testimonial_slide_view'
  | 'testimonial_autoplay_toggled'
  | 'testimonial_category_filter'
  | 'blog_tag_filter'
  | 'blog_article_read'
  | 'blog_subscription_banner'
  | 'support_channel_click'
  | 'support_faq_search'
  | 'support_incident_banner_view';

type AnalyticsPayload = {
  dealer?: string;
  postal?: string;
  postal_prefix?: string;
  radius_km?: number;
  filter?: string;
  filters?: string[];
  channel?: string;
  channel_id?: string;
  locale?: string;
  consentGranted?: boolean;
  latitude?: number;
  longitude?: number;
  target?: string;
  testimonial_id?: string;
  position?: number;
  autoplay?: boolean;
  enabled?: boolean;
  category?: string;
  tag?: string;
  result_count?: number;
  slug?: string;
  read_percent?: number;
  action?: string;
  query?: string;
  banner_id?: string;
};

const dataLayer: Array<{ event: EventName; payload: AnalyticsPayload }> = [];

// Fail closed: nothing reaches the data layer until a stored or freshly given
// consent decision is applied through setConsent().
let consentGranted = false;

export function setConsent(granted: boolean) {
  consentGranted = granted;
}

export function getDataLayerSnapshot() {
  return [...dataLayer];
}

export function resetDataLayer() {
  dataLayer.length = 0;
}

export function logAnalyticsEvent(name: EventName, payload: AnalyticsPayload) {
  if (!consentGranted) {
    console.info('[analytics:blocked]', name);
    return;
  }
  const enriched = {
    ...payload,
    consentGranted: true,
    postal_prefix: payload.postal?.slice(0, 3)
  };
  dataLayer.push({ event: name, payload: enriched });
  if (typeof window !== 'undefined') {
    (window as unknown as { dataLayer?: unknown[] }).dataLayer ||= [];
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push({ event: name, payload: enriched });
  }
  console.info('[analytics]', name, enriched);
}
