-- 000003_seed_admin_user.up.sql
-- Ensure admin user exists in staging/production via migrations (password: admin123)

INSERT INTO users (email, password_hash, role)
VALUES (
  'admin@finspeed.online',
  '$2a$10$P4AxZAZ/ildXBuaNc/YghuarHjScp87XyfKjw5pKNHbfWK4d25duS',
  'admin'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    role = 'admin';
