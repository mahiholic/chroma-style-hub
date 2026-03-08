
-- Fix: Drop restrictive user insert policies and recreate as permissive for orders
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
CREATE POLICY "Authenticated users can insert orders"
  ON public.orders FOR INSERT TO authenticated
  WITH CHECK (true);

-- Fix: Drop restrictive user insert policies and recreate as permissive for order_items
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;
CREATE POLICY "Authenticated users can insert order items"
  ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (true);

-- Fix: Drop restrictive user select policies and recreate as permissive for orders
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

-- Fix: Drop restrictive user select policies and recreate as permissive for order_items  
DROP POLICY IF EXISTS "Users can read own order items" ON public.order_items;
CREATE POLICY "Users can read own order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text));
