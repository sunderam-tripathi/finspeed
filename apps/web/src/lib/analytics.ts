type EventName =
  | 'dealer_search_submitted'
  | 'dealer_directions_click'
  | 'dealer_contact_action'
  | 'dealer_map_pin_select'
  | 'dealer_locator_outage'
  | 'support_channel_click';

type AnalyticsPayload = {
  dealer?: string;
  postal?: string;
  postal_prefix?: string;
  radius_km?: number;
  filter?: string;
  channel?: string;
  channel_id?: string;
  locale?: string;
  consentGranted?: boolean;
  latitude?: number;
  longitude?: number;
};

const dataLayer: Array<{ event: EventName; payload: AnalyticsPayload }> = [];

let consentGranted = true;

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
