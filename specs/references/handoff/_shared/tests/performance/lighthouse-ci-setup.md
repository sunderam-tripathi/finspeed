# Lighthouse CI Setup — REQ-001

## Goal
Automate performance budget checks for the home page (REQ-001) using Lighthouse CI (LHCI) in the deployment pipeline.

## Budgets (from `../_shared/tests/performance/load-plan.md`)
- LCP ≤ 2.5s (mobile 4G)
- TBT ≤ 200ms
- CLS < 0.1
- TTI ≤ 3.5s

## Suggested Directory Structure
```
ci/
  lighthouse/
    lighthouserc.json
    assert.json
    collect.sh
```

## Sample `lighthouserc.json`
```json
{
  "ci": {
    "collect": {
      "url": [
        "https://preview.finspeed.online/",
        "https://preview.finspeed.online/catalog"
      ],
      "numberOfRuns": 3,
      "settings": {
        "preset": "mobile",
        "formFactor": "mobile",
        "screenEmulation": { "mobile": true },
        "throttlingMethod": "simulate",
        "throttling": {
          "rttMs": 150,
          "throughputKbps": 1600,
          "cpuSlowdownMultiplier": 4
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500, "aggregationMethod": "median" }],
        "total-blocking-time": ["error", { "maxNumericValue": 200, "aggregationMethod": "median" }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1, "aggregationMethod": "median" }],
        "interactive": ["error", { "maxNumericValue": 3500, "aggregationMethod": "median" }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "./artifacts/perf"
    }
  }
}
```

## CI Integration Steps (GitHub Actions example)
```yaml
- name: Install Lighthouse CI
  run: npm install -g @lhci/cli
- name: Run Lighthouse CI
  run: lhci autorun --config=ci/lighthouse/lighthouserc.json
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  with:
    name: lighthouse-home
    path: artifacts/perf
```

## Documentation
- Record artifact links and run logs in `README.md` of CI repo or wiki.
- Update `../_shared/tests/performance/load-plan.md` if budgets change.

## Owner & Due Date
- Architecture Lead (AI-004) to implement by 2025-11-09.
