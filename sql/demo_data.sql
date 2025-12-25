-- Insert Demo Categories
INSERT INTO categories (name, slug) VALUES 
('Upper Wear', 'upper-wear'),
('Bottom Wear', 'bottom-wear'),
('Accessories', 'accessories')
ON CONFLICT (slug) DO NOTHING;

-- Insert Demo Brands
INSERT INTO brands (name, slug) VALUES 
('Aether Streetwear', 'aether-streetwear'),
('Vintage Denim Co', 'vintage-denim-co'),
('Essential Basics', 'essential-basics')
ON CONFLICT (slug) DO NOTHING;

-- Insert Demo Products
-- Note: Replace image_url with actual URLs after uploading to Supabase Storage
WITH cat AS (SELECT id, slug FROM categories),
     brand AS (SELECT id, slug FROM brands)
INSERT INTO products (name, slug, description, price, stock, brand_id, category_id, is_featured, is_active) VALUES 
(
  'Oversized Black Hoodie', 
  'oversized-black-hoodie', 
  'A premium oversized black streetwear hoodie made from high-quality heavy-weight cotton. Features a minimalist design and a relaxed fit.', 
  2499.00, 
  50, 
  (SELECT id FROM brand WHERE slug = 'aether-streetwear'), 
  (SELECT id FROM cat WHERE slug = 'upper-wear'),
  true,
  true
),
(
  'Vintage Distressed Denim Jacket', 
  'vintage-denim-jacket', 
  'Classic vintage blue denim jacket with a distressed look. Durable and stylish, perfect for layering.', 
  3999.00, 
  30, 
  (SELECT id FROM brand WHERE slug = 'vintage-denim-co'), 
  (SELECT id FROM cat WHERE slug = 'upper-wear'),
  true,
  true
),
(
  'White Linen Shirt', 
  'white-linen-shirt', 
  'Breathable white linen shirt for a relaxed and breezy look. Ideal for summer outings and casual meetups.', 
  1899.00, 
  40, 
  (SELECT id FROM brand WHERE slug = 'essential-basics'), 
  (SELECT id FROM cat WHERE slug = 'upper-wear'),
  false,
  true
),
(
  'Olive Green Cargo Pants', 
  'olive-cargo-pants', 
  'Stylish olive green cargo pants with multi-pocket design. Made from tough, comfortable cotton twill.', 
  2299.00, 
  25, 
  (SELECT id FROM brand WHERE slug = 'aether-streetwear'), 
  (SELECT id FROM cat WHERE slug = 'bottom-wear'),
  true,
  true
),
(
  'Essential White Tee Pack (3)', 
  'essential-white-tee-pack', 
  'A pack of 3 essential white t-shirts made from 100% premium cotton. The perfect base layer for any outfit.', 
  1299.00, 
  100, 
  (SELECT id FROM brand WHERE slug = 'essential-basics'), 
  (SELECT id FROM cat WHERE slug = 'upper-wear'),
  false,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Add Product Images (Placeholder URLs)
INSERT INTO product_images (product_id, url, alt_text)
SELECT id, 'https://placehold.co/600x800?text=Oversized+Hoodie', 'Oversized Black Hoodie' FROM products WHERE slug = 'oversized-black-hoodie'
UNION ALL
SELECT id, 'https://placehold.co/600x800?text=Denim+Jacket', 'Vintage Denim Jacket' FROM products WHERE slug = 'vintage-denim-jacket'
UNION ALL
SELECT id, 'https://placehold.co/600x800?text=Linen+Shirt', 'White Linen Shirt' FROM products WHERE slug = 'white-linen-shirt'
UNION ALL
SELECT id, 'https://placehold.co/600x800?text=Cargo+Pants', 'Olive Cargo Pants' FROM products WHERE slug = 'olive-cargo-pants'
UNION ALL
SELECT id, 'https://placehold.co/600x800?text=White+Tee+Pack', 'Essential White Tee Pack' FROM products WHERE slug = 'essential-white-tee-pack';
