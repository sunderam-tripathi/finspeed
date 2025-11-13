| Event | Producer | Consumers | Contract | Notes |
|-------|----------|-----------|----------|-------|
| site.interaction.analytics.v1:support_channel_click | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Captures channel interactions with `channel_id`, `consent_granted`. |
| site.interaction.analytics.v1:support_faq_search | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Logs search query and `result_count`. |
| site.interaction.analytics.v1:support_incident_banner_view | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Fired when outage banner shown; includes `banner_id`. |
