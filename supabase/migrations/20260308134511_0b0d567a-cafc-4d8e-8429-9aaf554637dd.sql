-- Allow authenticated users to insert orders and order_items
CREATE POLICY "Authenticated users can insert orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can read own orders"
ON public.orders FOR SELECT TO authenticated
USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Authenticated users can insert order items"
ON public.order_items FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can read own order items"
ON public.order_items FOR SELECT TO authenticated
USING (order_id IN (SELECT id FROM public.orders WHERE customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- Allow authenticated users to insert/read own customer record
CREATE POLICY "Users can insert own customer"
ON public.customers FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own customer"
ON public.customers FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update own customer"
ON public.customers FOR UPDATE TO authenticated
USING (user_id = auth.uid());