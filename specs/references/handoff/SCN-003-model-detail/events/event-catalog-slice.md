| Event | Producer | Consumers | Contract | Notes |
|-------|----------|-----------|----------|-------|
| site.interaction.analytics.v1:model_dealer_cta_click | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Fired when visitors click `Find at a dealer`; includes `model_slug`, consent flag. |
| site.interaction.analytics.v1:model_gallery_interaction | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Captures media interactions (`asset_type`, `frame_index`) for hero/gallery assets. |
| site.interaction.analytics.v1:model_specs_copy | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Tracks copy interactions on specs/sizing sections. |
| site.interaction.analytics.v1:model_jsonld_validation_error | Frontend | GA4 dashboards | events/site.interaction.analytics.v1.json | Emits when client JSON-LD validation fails; includes `error_code`. |
