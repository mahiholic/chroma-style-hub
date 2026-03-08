
-- Add fields to orders
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS delivery_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS cancel_reason text,
  ADD COLUMN IF NOT EXISTS return_reason text,
  ADD COLUMN IF NOT EXISTS return_requested_at timestamp with time zone;

-- Add image_url to order_items
ALTER TABLE public.order_items 
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS size text,
  ADD COLUMN IF NOT EXISTS color text;

-- Create order_reviews table
CREATE TABLE public.order_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.order_reviews ENABLE ROW LEVEL SECURITY;

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
  ON public.order_reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read own reviews
CREATE POLICY "Users can read own reviews"
  ON public.order_reviews FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can read reviews (for product pages)
CREATE POLICY "Anyone can read reviews"
  ON public.order_reviews FOR SELECT
  USING (true);

-- Admins can manage reviews
CREATE POLICY "Admins can manage reviews"
  ON public.order_reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
