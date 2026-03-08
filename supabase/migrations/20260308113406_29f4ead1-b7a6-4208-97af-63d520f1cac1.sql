
-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2),
  category TEXT NOT NULL DEFAULT 'general',
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read customers" ON public.customers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update customers" ON public.customers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete customers" ON public.customers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  phone TEXT,
  shipping_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'card',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
