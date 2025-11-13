# Frozen Contracts — SCN-003

| Contract | Purpose | Notes |
|----------|---------|-------|
| IC-11-model-detail.md | Defines layout, behaviours, analytics for model detail page | Mirrors `61-interfaces/ui-forms/model-detail.md`; status Frozen v1.0. |
| catalog-item.schema.json | Validates `CATALOG-001` source feeding model detail content | Run `npm run validate:catalog` in CI before build to block bad data. |
