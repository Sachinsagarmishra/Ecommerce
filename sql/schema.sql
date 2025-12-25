-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES
create type user_role as enum ('admin', 'customer');

-- PROFILES
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text,
  role user_role default 'customer' not null,
  has_password boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BRANDS
create table brands (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CATEGORIES
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  parent_id uuid references categories(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COLLECTIONS
create table collections (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price decimal(12,2) not null,
  discounted_price decimal(12,2),
  stock integer default 0 not null,
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  is_featured boolean default false,
  is_active boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCT IMAGES
create table product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  url text not null,
  alt_text text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCT COLLECTIONS (M2M)
create table product_collections (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  collection_id uuid references collections(id) on delete cascade not null,
  unique(product_id, collection_id)
);

-- COUPONS
create table coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'fixed')) not null,
  discount_value decimal(12,2) not null,
  min_order_amount decimal(12,2) default 0,
  active_from timestamp with time zone,
  active_to timestamp with time zone,
  usage_limit integer,
  used_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CART
create table carts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  session_id text, -- for guest checkout
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- CART ITEMS
create table cart_items (
  id uuid default uuid_generate_v4() primary key,
  cart_id uuid references carts(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(cart_id, product_id)
);

-- ORDERS
create type order_status as enum ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned');

create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete set null,
  status order_status default 'pending' not null,
  total_amount decimal(12,2) not null,
  subtotal decimal(12,2) not null,
  discount_amount decimal(12,2) default 0,
  shipping_address jsonb not null,
  billing_address jsonb,
  razorpay_order_id text unique,
  customer_email text,
  customer_phone text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  quantity integer not null,
  price_at_time decimal(12,2) not null,
  metadata jsonb default '{}'::jsonb
);

-- PAYMENTS
create table payments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  razorpay_payment_id text unique,
  razorpay_signature text,
  amount decimal(12,2) not null,
  status text not null,
  method text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ADDRESSES
create table addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text default 'India' not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES

-- Enable RLS
alter table profiles enable row level security;
alter table brands enable row level security;
alter table categories enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_collections enable row level security;
alter table coupons enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table addresses enable row level security;

-- Profiles: Users can read their own profile, admins can see all
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (is_admin());
create policy "Admins can update all profiles" on profiles for update using (is_admin());

-- Brands/Categories/Collections/Products: Public select, Admin all
create policy "Public read brands" on brands for select using (true);
create policy "Admin brand management" on brands for all using (is_admin());

create policy "Public read categories" on categories for select using (true);
create policy "Admin category management" on categories for all using (is_admin());

create policy "Public read collections" on collections for select using (true);
create policy "Admin collection management" on collections for all using (is_admin());

create policy "Public read active products" on products for select using (is_active = true);
create policy "Admin product management" on products for all using (is_admin());

create policy "Public read product images" on product_images for select using (true);
create policy "Admin product images management" on product_images for all using (is_admin());

-- Carts: Users can manage their own cart
create policy "Users can manage own cart" on carts for all using (auth.uid() = user_id);
create policy "Users can manage own cart items" on cart_items for all using (
  exists (select 1 from carts where id = cart_id and user_id = auth.uid())
);

-- Orders: Users can read own orders, admins can read all
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Admins can view all orders" on orders for select using (is_admin());
create policy "Admins can update orders" on orders for update using (is_admin());

-- Functions
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

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
