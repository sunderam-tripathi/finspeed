-- 000003_seed_admin_user.down.sql
-- Remove the seeded admin user

DELETE FROM users WHERE email = 'admin@finspeed.online';
