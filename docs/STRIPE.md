# [DEPRECATED] Stripe Integration Guide

> This integration has been replaced by Razorpay. See `docs/RAZORPAY.md` for the current implementation and setup. The content below is retained for historical reference only.

This document explains how Stripe is integrated in the Finspeed stack and how to run it locally and in staging/production.

## Endpoints

- POST `/api/v1/payments/stripe/checkout-session` (protected)
  - Body: `{ "order_id": number }`
  - Returns: `{ "session_id": string, "url": string }`
  - Purpose: Creates a Stripe Checkout Session and returns the hosted checkout URL for redirect.

- POST `/api/v1/payments/stripe/webhook` (public)
  - Verifies Stripe signature and processes events.
  - On `checkout.session.completed`, marks the order as paid and upserts a `payments` row.

## Required Environment Variables

Backend (`api`):
- `STRIPE_SECRET_KEY` (e.g. `sk_test_...`)
- `STRIPE_WEBHOOK_SECRET` (e.g. `whsec_...`)
- `FRONTEND_BASE_URL` (e.g. `http://localhost:3000` or your deployed frontend URL)

Frontend (`frontend`):
- `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8080/api/v1`)

An example file is provided at `api/.env.local.example`.

## Local Development

1. Copy example env and set values:
   ```bash
   cp api/.env.local.example api/.env.local
   # Set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, FRONTEND_BASE_URL
   ```

2. Start the stack:
   ```bash
   make dev
   # or: docker compose up --build
   ```

3. Stripe CLI webhook forwarding (recommended):
   ```bash
   # Install Stripe CLI: https://stripe.com/docs/stripe-cli
   stripe listen --forward-to localhost:8080/api/v1/payments/stripe/webhook
   # Export the webhook secret from the output as STRIPE_WEBHOOK_SECRET
   ```

4. Create an order from the frontend checkout and choose Stripe as the payment method. You will be redirected to Stripe Checkout.

5. On successful payment, Stripe redirects to:
   - `${FRONTEND_BASE_URL}/orders/:orderId?success=1&session_id=...`

## Staging/Production

- Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `FRONTEND_BASE_URL` as environment variables or secrets in your runtime (e.g., Cloud Run).
- Ensure the public webhook endpoint `/api/v1/payments/stripe/webhook` is reachable by Stripe.
- In Terraform/CI, configure the environment variables for the API service, and the frontend `NEXT_PUBLIC_API_URL` accordingly.

## Notes

- The API endpoint `/payments/stripe/checkout-session` requires a valid JWT and verifies the order belongs to the authenticated user and is pending.
- The cart is not cleared on Stripe initiation; it is handled after payment success via webhook/order update.
