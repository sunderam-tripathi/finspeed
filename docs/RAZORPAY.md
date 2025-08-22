# Razorpay Integration Guide

This document explains how Razorpay is integrated in the Finspeed stack and how to run it locally and in staging/production.

## Endpoints

- POST `/api/v1/payments/razorpay/order` (protected)
  - Body: `{ "order_id": number }`
  - Returns: `{ "order_id": number, "razorpay_order_id": string, "amount": number /* paise */, "currency": "INR", "key_id": string }`
  - Purpose: Creates a Razorpay Order for the given order and returns details for Checkout.js.

- POST `/api/v1/payments/razorpay/verify` (protected)
  - Body: `{ "order_id": number, "razorpay_order_id": string, "razorpay_payment_id": string, "razorpay_signature": string }`
  - Returns: `{ "status": "verified" }`
  - Purpose: Verifies the payment signature returned by Checkout and marks the order as paid.

- POST `/api/v1/payments/razorpay/webhook` (public)
  - Verifies the webhook signature and acknowledges the event. Optional enrichment can be added later.

## Required Environment Variables

Backend (`api`):
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `FRONTEND_BASE_URL` (e.g. `http://localhost:3000`)

Frontend (`frontend`):
- `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8080/api/v1`)

An example file is provided at `api/.env.local.example`.

## Local Development

1. Copy example env and set values:
   ```bash
   cp api/.env.local.example api/.env.local
   # Set RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, FRONTEND_BASE_URL
   ```

2. Start the stack:
   ```bash
   make dev
   # or: docker compose up --build
   ```

3. Place an order from the frontend checkout and choose Razorpay as the payment method. The Razorpay Checkout modal will open.

4. On successful payment, the frontend calls `/payments/razorpay/verify` to verify the signature and then redirects to:
   - `${FRONTEND_BASE_URL}/orders/:orderId?success=1`

## Notes

- Payment initiation and verification endpoints are protected by JWT.
- Webhook endpoint is public but verifies the signature using `RAZORPAY_WEBHOOK_SECRET`.
- Payment records are upserted with provider `razorpay`, and the order is marked `paid` on successful verification.
- COD remains available as an alternative payment method.
