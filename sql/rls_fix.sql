-- 1. Create the helper function
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 2. Update RLS Policies (Drop then Recreate)

-- Profiles
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Admins can update all profiles" on profiles;
create policy "Admins can view all profiles" on profiles for select using (is_admin());
create policy "Admins can update all profiles" on profiles for update using (is_admin());

-- Brands
drop policy if exists "Admin brand management" on brands;
create policy "Admin brand management" on brands for all using (is_admin());

-- Categories
drop policy if exists "Admin category management" on categories;
create policy "Admin category management" on categories for all using (is_admin());

-- Collections
drop policy if exists "Admin collection management" on collections;
create policy "Admin collection management" on collections for all using (is_admin());

-- Products
drop policy if exists "Admin product management" on products;
create policy "Admin product management" on products for all using (is_admin());

-- Product Images
drop policy if exists "Admin product images management" on product_images;
create policy "Admin product images management" on product_images for all using (is_admin());

-- Orders
drop policy if exists "Admins can view all orders" on orders;
drop policy if exists "Admins can update orders" on orders;
create policy "Admins can view all orders" on orders for select using (is_admin());
create policy "Admins can update orders" on orders for update using (is_admin());

