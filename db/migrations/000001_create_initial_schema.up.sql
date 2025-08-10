-- 000001_create_initial_schema.up.sql

CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "password_hash" varchar NOT NULL,
  "role" varchar DEFAULT 'customer',
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" bigserial PRIMARY KEY,
  "name" varchar NOT NULL,
  "slug" varchar UNIQUE NOT NULL,
  "parent_id" bigint REFERENCES "categories"("id")
);

CREATE TABLE "products" (
  "id" bigserial PRIMARY KEY,
  "title" varchar NOT NULL,
  "slug" varchar UNIQUE NOT NULL,
  "price" decimal(10, 2) NOT NULL,
  "currency" varchar DEFAULT 'INR',
  "sku" varchar UNIQUE,
  "hsn" varchar,
  "stock_qty" integer NOT NULL DEFAULT 0,
  "category_id" bigint REFERENCES "categories"("id"),
  "specs_json" jsonb,
  "warranty_months" integer,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz
);

CREATE TABLE "product_images" (
  "id" bigserial PRIMARY KEY,
  "product_id" bigint NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "url" varchar NOT NULL,
  "alt" varchar,
  "is_primary" boolean DEFAULT false
);

CREATE TABLE "orders" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint NOT NULL REFERENCES "users"("id"),
  "status" varchar NOT NULL DEFAULT 'pending',
  "subtotal" decimal(10, 2) NOT NULL,
  "shipping_fee" decimal(10, 2) NOT NULL,
  "tax_amount" decimal(10, 2) NOT NULL,
  "total" decimal(10, 2) NOT NULL,
  "payment_id" varchar,
  "shipping_address_json" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "order_items" (
  "id" bigserial PRIMARY KEY,
  "order_id" bigint NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" bigint NOT NULL REFERENCES "products"("id"),
  "qty" integer NOT NULL,
  "price_each" decimal(10, 2) NOT NULL
);

CREATE TABLE "payments" (
  "id" bigserial PRIMARY KEY,
  "order_id" bigint NOT NULL REFERENCES "orders"("id"),
  "provider" varchar,
  "provider_ref" varchar UNIQUE,
  "status" varchar NOT NULL,
  "amount" decimal(10, 2) NOT NULL,
  "currency" varchar,
  "raw_webhook_json" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
