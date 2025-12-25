-- Enable guest access to carts via session_id
ALTER TABLE public.carts DROP CONSTRAINT IF EXISTS carts_user_id_key;
ALTER TABLE public.carts ADD COLUMN IF NOT EXISTS session_id text;
CREATE UNIQUE INDEX IF NOT EXISTS carts_session_id_idx ON public.carts (session_id) WHERE user_id IS NULL;

-- Drop old policies
DROP POLICY IF EXISTS "Users can manage own cart" ON public.carts;
DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;

-- New Cart Policies
CREATE POLICY "Anyone can manage own session cart" ON public.carts
  FOR ALL USING (
    (auth.uid() = user_id) OR (session_id IS NOT NULL AND user_id IS NULL)
  );

CREATE POLICY "Anyone can manage own session cart items" ON public.cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE id = cart_id 
      AND (user_id = auth.uid() OR (session_id IS NOT NULL AND user_id IS NULL))
    )
  );

-- Fix Admin Order Visibility
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow guests to see their own orders if they have the ID (for success page)
DROP POLICY IF EXISTS "Public can view own orders" ON public.orders;
CREATE POLICY "Public can view own orders" ON public.orders
  FOR SELECT USING (
    (auth.uid() = user_id) OR (user_id IS NULL)
  );
