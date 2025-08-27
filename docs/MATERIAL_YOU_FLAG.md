# Material You (M3) Feature Flag

This repository supports a controlled rollout of Material You (Material Design 3) theming across both Next.js apps (`frontend/` and `admin-app/`) using a build-time flag.

- Flag: `NEXT_PUBLIC_ENABLE_M3`
- Values: `1`/`true` to enable; `0`/`false` to disable
- Default: Enabled in all environments (frontend and admin). Set to `0`/`false` to disable temporarily.

## How it works

- Theming provider and controls are gated by `NEXT_PUBLIC_ENABLE_M3` in:
  - `frontend/src/app/layout.tsx`
  - `admin-app/src/app/layout.tsx`
- Admin theming controls (`ThemeControls`) allow seed color and light/dark toggles when enabled.
- Theme tokens are generated at runtime using `@material/material-color-utilities` and applied via CSS variables.

## CI/CD integration

The flag is injected during container builds to ensure both server and client code receive the setting:

- Staging (`.github/workflows/deploy-staging.yml`):
  - Frontend image build-args: `NEXT_PUBLIC_ENVIRONMENT=staging`, `NEXT_PUBLIC_ENABLE_M3=1`
- Production (`.github/workflows/deploy-production.yml`):
  - Frontend image build-args: `NEXT_PUBLIC_ENVIRONMENT=production`, `NEXT_PUBLIC_ENABLE_M3=1`
  - Static export build runs with: `NEXT_PUBLIC_ENVIRONMENT=production NEXT_PUBLIC_ENABLE_M3=1 BUILD_TARGET=static pnpm run build`

## Dockerfiles

Both Next.js Dockerfiles accept and propagate the flag to build and runtime stages:

- `docker/frontend.Dockerfile`:
  - `ARG NEXT_PUBLIC_ENABLE_M3` + `ENV NEXT_PUBLIC_ENABLE_M3=$NEXT_PUBLIC_ENABLE_M3` in builder and prod stages
- `docker/admin.Dockerfile`:
  - `ARG NEXT_PUBLIC_ENABLE_M3` + `ENV NEXT_PUBLIC_ENABLE_M3=$NEXT_PUBLIC_ENABLE_M3` in builder and runner stages

This ensures:
- Client bundles are built with the correct flag value
- Server-side code can also read `process.env.NEXT_PUBLIC_ENABLE_M3` at runtime in Cloud Run

## Local development

Material You is ON by default in local dev. To disable temporarily:

- Using Next directly:
  - Frontend (disable): `NEXT_PUBLIC_ENABLE_M3=0 pnpm dev` (from `frontend/`)
  - Admin (disable): `NEXT_PUBLIC_ENABLE_M3=0 npm run dev` (from `admin-app/`)
- Using Docker Compose (optional): add to `services.frontend.environment` in `docker-compose.yml`:
  ```yaml
  - NEXT_PUBLIC_ENABLE_M3=0
  ```

## Notes

- Fallback behavior is preserved when the flag is off; Tailwind and existing design remain intact.
- This rollout adheres to GitFlow: feature branches target `develop` (staging), `main` is for production.
- If you need to force-enable in production temporarily, rebuild the image with `NEXT_PUBLIC_ENABLE_M3=1` and redeploy (or set a runtime env var in Cloud Run, then restart), then revert when done.
