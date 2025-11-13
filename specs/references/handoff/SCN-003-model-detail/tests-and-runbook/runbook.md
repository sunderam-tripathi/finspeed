# Runbook — SCN-003 Model detail

## Deploy
- Confirm `CATALOG-001` passes schema validation and localized MDX assets build.
- Run Playwright suite `TST-E2E-003` (desktop + mobile) and JSON-LD validation script.
- Enable `modelDetail.enable` flag in `.env` or feature toggle service; ship via static deploy.

## Rollback
- Toggle `modelDetail.enable=false` and redeploy previous static build artifact.
- Restore prior JSON-LD snapshot and hero media assets if regression traced to content.
- Re-run smoke tests to verify home/catalog unaffected.

## First response
- **Missing specs or warranty copy**: Check catalog CSV diff; hotfix content and re-run build.
- **JSON-LD validation failures**: Review GA4 `model_jsonld_validation_error` payloads, validate locally, redeploy after fix.
- **Dealer CTA errors**: Verify dealer locator availability; if outage, update CTA tooltip copy and incident banner via support status JSON.
