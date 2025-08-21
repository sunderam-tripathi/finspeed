-- 001_initial_data.sql
-- Initial seed data for Finspeed

-- Insert categories
INSERT INTO categories (id, name, slug, parent_id) VALUES
(1, 'Road Bikes', 'road-bikes', NULL),
(2, 'Mountain Bikes', 'mountain-bikes', NULL),
(3, 'Hybrid Bikes', 'hybrid-bikes', NULL),
(4, 'Electric Bikes', 'electric-bikes', NULL),
(5, 'Accessories', 'accessories', NULL),
(6, 'Helmets', 'helmets', 5),
(7, 'Lights', 'lights', 5),
(8, 'Locks', 'locks', 5);

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password_hash, role) VALUES
(1, 'admin@finspeed.online', '$2a$10$P4AxZAZ/ildXBuaNc/YghuarHjScp87XyfKjw5pKNHbfWK4d25duS', 'admin');

-- Insert test customer (password: customer123)
INSERT INTO users (id, email, password_hash, role) VALUES
(2, 'customer@finspeed.online', '$2a$10$geZUWBEZEf6/6HdI8FOloeFbt3c3qTik6kINxLKfQ2HM8P9EIfkha', 'customer');

-- Insert sample products
INSERT INTO products (id, title, slug, price, currency, sku, hsn, stock_qty, category_id, specs_json, warranty_months) VALUES
(1, 'Trek Domane AL 2', 'trek-domane-al-2', 85000.00, 'INR', 'TRK-DOM-AL2-2024', '87120000', 15, 1, 
 '{"frame": "Alpha Aluminum", "groupset": "Shimano Claris", "wheels": "Bontrager Affinity", "weight": "10.5kg", "sizes": ["52cm", "54cm", "56cm", "58cm"]}', 24),

(2, 'Giant Talon 3', 'giant-talon-3', 45000.00, 'INR', 'GNT-TAL3-2024', '87120000', 8, 2,
 '{"frame": "ALUXX Aluminum", "suspension": "SR Suntour XCT", "groupset": "Shimano Altus", "wheels": "Giant GX03V", "weight": "14.2kg", "sizes": ["S", "M", "L", "XL"]}', 12),

(3, 'Specialized Sirrus X 3.0', 'specialized-sirrus-x-30', 65000.00, 'INR', 'SPZ-SIR-X30-2024', '87120000', 12, 3,
 '{"frame": "A1 Premium Aluminum", "groupset": "Shimano Acera", "wheels": "Specialized Borough", "weight": "12.8kg", "sizes": ["S", "M", "L", "XL"]}', 18),

(4, 'Hero Lectro C5', 'hero-lectro-c5', 55000.00, 'INR', 'HRO-LEC-C5-2024', '87120000', 6, 4,
 '{"frame": "Steel", "motor": "250W Brushless", "battery": "36V 10.4Ah", "range": "25-30km", "weight": "22kg", "sizes": ["One Size"]}', 12),

(5, 'Kask Protone Helmet', 'kask-protone-helmet', 15000.00, 'INR', 'KSK-PRO-2024', '65069990', 25, 6,
 '{"material": "Polycarbonate", "ventilation": "26 vents", "weight": "230g", "certification": "CE EN1078", "sizes": ["S", "M", "L"]}', 24),

(6, 'Lezyne Macro Drive 1300XL', 'lezyne-macro-drive-1300xl', 8500.00, 'INR', 'LZN-MD-1300XL', '85131900', 18, 7,
 '{"lumens": "1300", "runtime": "1.5-150hrs", "battery": "Li-ion", "modes": "9", "weight": "136g", "waterproof": "IPX7"}', 12),

(7, 'Abus Granit X-Plus 540', 'abus-granit-x-plus-540', 12000.00, 'INR', 'ABS-GRN-XP540', '83014000', 10, 8,
 '{"type": "U-Lock", "security": "Level 15", "shackle": "13mm", "material": "Hardened Steel", "weight": "1.77kg", "dimensions": "230x108x13mm"}', 36);

-- Insert product images
INSERT INTO product_images (product_id, url, alt, is_primary) VALUES
(1, '/images/products/trek-domane-al-2-main.jpg', 'Trek Domane AL 2 - Main View', true),
(1, '/images/products/trek-domane-al-2-side.jpg', 'Trek Domane AL 2 - Side View', false),
(1, '/images/products/trek-domane-al-2-detail.jpg', 'Trek Domane AL 2 - Detail View', false),

(2, '/images/products/giant-talon-3-main.jpg', 'Giant Talon 3 - Main View', true),
(2, '/images/products/giant-talon-3-side.jpg', 'Giant Talon 3 - Side View', false),

(3, '/images/products/specialized-sirrus-x-30-main.jpg', 'Specialized Sirrus X 3.0 - Main View', true),
(3, '/images/products/specialized-sirrus-x-30-side.jpg', 'Specialized Sirrus X 3.0 - Side View', false),

(4, '/images/products/hero-lectro-c5-main.jpg', 'Hero Lectro C5 - Main View', true),
(4, '/images/products/hero-lectro-c5-battery.jpg', 'Hero Lectro C5 - Battery Detail', false),

(5, '/images/products/kask-protone-helmet-main.jpg', 'Kask Protone Helmet - Main View', true),
(6, '/images/products/lezyne-macro-drive-1300xl-main.jpg', 'Lezyne Macro Drive 1300XL - Main View', true),
(7, '/images/products/abus-granit-x-plus-540-main.jpg', 'Abus Granit X-Plus 540 - Main View', true);

-- Reset sequences to avoid conflicts
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_images_id_seq', (SELECT MAX(id) FROM product_images));
