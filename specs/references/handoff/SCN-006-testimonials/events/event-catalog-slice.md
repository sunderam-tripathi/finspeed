| Event | Producer | Consumers | Contract | Notes |
|-------|----------|-----------|----------|-------|
| site.interaction.analytics.v1:testimonial_slide_view | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Emitted when slide enters view; payload carries `testimonial_id`, `position`. |
| site.interaction.analytics.v1:testimonial_autoplay_toggled | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Fired when visitors enable/disable autoplay; includes `enabled` state. |
| site.interaction.analytics.v1:testimonial_category_filter | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Captures category filter usage with `category`. |
