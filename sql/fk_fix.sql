-- Fix relationships to allow joining with Profiles table directly
-- This resolves the PGRST200 error when joining orders with profiles

-- Fix orders foreign key
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey,
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Fix carts foreign key
ALTER TABLE carts 
DROP CONSTRAINT IF EXISTS carts_user_id_fkey,
ADD CONSTRAINT carts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Fix addresses foreign key
ALTER TABLE addresses 
DROP CONSTRAINT IF EXISTS addresses_user_id_fkey,
ADD CONSTRAINT addresses_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
