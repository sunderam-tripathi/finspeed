-- 000002_alter_users_password_hash_type.down.sql

ALTER TABLE "users" ALTER COLUMN "password_hash" SET DATA TYPE varchar;
