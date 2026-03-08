
-- Allow users to update their own orders (for cancel/return)
CREATE POLICY "Users can update own orders"
  ON public.orders FOR UPDATE TO authenticated
  USING (customer_email = public.get_auth_email())
  WITH CHECK (customer_email = public.get_auth_email());
