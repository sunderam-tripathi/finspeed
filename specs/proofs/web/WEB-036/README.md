# WEB-036 Proof - Distributor portal access gate and consent fail-closed

## Scope

The implementation merged to `main` on 2026-07-25 via pull request #1
(`fix/distributor-access-and-consent-default`, commit `a41bd8c`). This bundle
records the proof evidence that was still outstanding when the slice code
landed.

## Contract evidence

- `contract-tests-2026-07-26.txt` - `npx playwright test tests/distributor-access.spec.ts`
  run locally against the merged code on 2026-07-26: **5 passed, 0 failed**.
  1. Every portal path redirects to sign in without a session.
  2. Dealer cost prices and margins stay hidden until sign in.
  3. The sign-in screen states that credentials are not verified.
  4. Signing in opens the portal and signing out closes it again.
  5. A reload drops the session rather than leaving the portal open.

## Consent fail-closed

`analytics.ts` initialises `consentGranted = false`, and `consent.ts` applies
the stored decision on client load and on the cross-tab `storage` event, so a
stored denial is honoured on every subsequent visit. This behaviour landed with
the merged commit; the five contract tests above exercise the portal gate,
and the consent path is asserted by the existing dealer-locator consent
payload coverage in the regression suite.

## Honest limits

- The gate is presentation-level only: `distributor.js` pricing is still
  compiled into the public client bundle. Moving it behind an authenticated
  server route is recorded as a follow-up in the plan and remains open.
- Production verification is pending: no deployment has been authorised since
  the merge, so this proof covers local evidence against the merged revision
  only. The production check belongs to the deployment slice once the user
  approves a deploy.

final result: passed (local contract evidence; production pending deployment approval)
