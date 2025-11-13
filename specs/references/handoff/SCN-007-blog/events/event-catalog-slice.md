| Event | Producer | Consumers | Contract | Notes |
|-------|----------|-----------|----------|-------|
| site.interaction.analytics.v1:blog_tag_filter | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Captures selected `tag` and `results_count` when filters applied. |
| site.interaction.analytics.v1:blog_article_read | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Fires at 25/50/75/100% read depth with `read_percent`, `slug`. |
| site.interaction.analytics.v1:blog_subscription_banner | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Tracks banner impressions/submits referencing `IC-7`; payload includes optional `subscription_email_hash`. |
