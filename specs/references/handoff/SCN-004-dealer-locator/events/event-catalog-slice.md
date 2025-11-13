| Event | Producer | Consumers | Contract | Notes |
|-------|----------|-----------|----------|-------|
| site.interaction.analytics.v1:dealer_search_submitted | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Fired on postal search; captures `postal_code_prefix`, `radius_km`, `filters`. |
| site.interaction.analytics.v1:dealer_directions_click | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Tracks directions CTA taps with `dealer_id`, optional `model_slug`. |
| site.interaction.analytics.v1:dealer_contact_action | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Logs phone/email/WhatsApp clicks with `channel`. |
| site.interaction.analytics.v1:dealer_no_results | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Emitted when filters return zero dealers; includes `radius_km`, `filters`. |
