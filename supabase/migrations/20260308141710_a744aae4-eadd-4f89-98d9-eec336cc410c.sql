
-- Drop problematic policies that query auth.users
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can read own order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;

-- Create a security definer function to get user email safely
CREATE OR REPLACE FUNCTION public.get_auth_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid()
$$;

-- Recreate insert policies (permissive, no subquery on auth.users)
CREATE POLICY "Authenticated users can insert orders"
  ON public.orders FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert order items"
  ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (true);

-- Recreate select policies using security definer function
CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (customer_email = public.get_auth_email());

CREATE POLICY "Users can read own order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE customer_email = public.get_auth_email()));
