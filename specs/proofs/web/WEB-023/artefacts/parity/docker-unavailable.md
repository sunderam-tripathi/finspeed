# Docker Parity Limitation

`node tools/dev/parity-stack.mjs ensure` completed and refreshed the parity state, but the Windows environment does not have the Docker CLI installed. Therefore `docker compose ps` could not provide an independent container-state listing.

For this storefront-only slice, executable parity is covered by the Next.js production build, 15-test Playwright suite, in-app-browser interaction checks, side-by-side visual QA, and the successful Amplify production release.
