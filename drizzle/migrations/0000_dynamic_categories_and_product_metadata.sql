CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active categories"
ON public.categories FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Admins can read all categories"
ON public.categories FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert categories"
ON public.categories FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update categories"
ON public.categories FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete categories"
ON public.categories FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.products
  ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  ADD COLUMN image_urls text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN available_sizes text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN available_colors text[] NOT NULL DEFAULT '{}'::text[];

CREATE INDEX products_category_id_idx ON public.products(category_id);

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();