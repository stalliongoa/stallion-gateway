-- =============================================
-- SHOPPIE STALLION ECOMMERCE DATABASE SCHEMA
-- =============================================

-- Create app role enum if not exists (for ecommerce roles)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customer_status') THEN
    CREATE TYPE customer_status AS ENUM ('pending', 'approved', 'blocked');
  END IF;
END $$;

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE public.shop_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.shop_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  filter_config JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories viewable by everyone" ON public.shop_categories
FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage categories" ON public.shop_categories
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- BRANDS TABLE
-- =============================================
CREATE TABLE public.shop_brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands viewable by everyone" ON public.shop_brands
FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage brands" ON public.shop_brands
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- VENDORS/SUPPLIERS TABLE
-- =============================================
CREATE TABLE public.shop_vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  pincode TEXT,
  gst_number TEXT,
  payment_terms TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view vendors" ON public.shop_vendors
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage vendors" ON public.shop_vendors
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE public.shop_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT UNIQUE,
  barcode TEXT,
  short_description TEXT,
  description TEXT,
  category_id UUID REFERENCES public.shop_categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES public.shop_brands(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.shop_vendors(id) ON DELETE SET NULL,
  mrp DECIMAL(12,2),
  selling_price DECIMAL(12,2),
  purchase_price DECIMAL(12,2),
  cost_price DECIMAL(12,2),
  tax_rate DECIMAL(5,2) DEFAULT 18.00,
  hsn_code TEXT,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  weight_kg DECIMAL(8,3),
  dimensions_cm TEXT,
  warranty_months INTEGER,
  datasheet_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  shopify_product_id TEXT,
  shopify_variant_id TEXT,
  shopify_sync_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;

-- Products viewable by everyone (but price hidden for guests via frontend)
CREATE POLICY "Products viewable by everyone" ON public.shop_products
FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage products" ON public.shop_products
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for fast filtering
CREATE INDEX idx_products_category ON public.shop_products(category_id);
CREATE INDEX idx_products_brand ON public.shop_products(brand_id);
CREATE INDEX idx_products_sku ON public.shop_products(sku);
CREATE INDEX idx_products_price ON public.shop_products(selling_price);
CREATE INDEX idx_products_specs ON public.shop_products USING GIN(specifications);
CREATE INDEX idx_products_tags ON public.shop_products USING GIN(tags);

-- =============================================
-- PRODUCT SPECIFICATIONS DEFINITIONS
-- =============================================
CREATE TABLE public.shop_spec_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.shop_categories(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  field_type TEXT DEFAULT 'text',
  options JSONB,
  is_filterable BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_spec_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spec definitions viewable by everyone" ON public.shop_spec_definitions
FOR SELECT USING (true);

CREATE POLICY "Admins can manage spec definitions" ON public.shop_spec_definitions
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- CUSTOMER PROFILES
-- =============================================
CREATE TABLE public.shop_customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT,
  gst_number TEXT,
  phone TEXT,
  billing_address JSONB,
  shipping_address JSONB,
  customer_type TEXT DEFAULT 'retail',
  status customer_status DEFAULT 'approved',
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(14,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own profile" ON public.shop_customers
FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Customers can update own profile" ON public.shop_customers
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert customer profile" ON public.shop_customers
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage customers" ON public.shop_customers
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- SHOPPING CART
-- =============================================
CREATE TABLE public.shop_cart (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.shop_products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.shop_cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart" ON public.shop_cart
FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE public.shop_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.shop_customers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  subtotal DECIMAL(14,2) NOT NULL,
  tax_amount DECIMAL(14,2) DEFAULT 0,
  shipping_amount DECIMAL(14,2) DEFAULT 0,
  discount_amount DECIMAL(14,2) DEFAULT 0,
  total_amount DECIMAL(14,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_address JSONB,
  shipping_address JSONB,
  notes TEXT,
  admin_notes TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.shop_orders
FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create orders" ON public.shop_orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage orders" ON public.shop_orders
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_orders_user ON public.shop_orders(user_id);
CREATE INDEX idx_orders_status ON public.shop_orders(status);
CREATE INDEX idx_orders_number ON public.shop_orders(order_number);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE public.shop_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.shop_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.shop_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2),
  tax_amount DECIMAL(12,2),
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.shop_order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.shop_orders 
    WHERE id = order_id AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Users can insert order items" ON public.shop_order_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.shop_orders 
    WHERE id = order_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage order items" ON public.shop_order_items
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- PURCHASE HISTORY (FROM VENDORS)
-- =============================================
CREATE TABLE public.shop_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_number TEXT NOT NULL UNIQUE,
  vendor_id UUID REFERENCES public.shop_vendors(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.shop_products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(12,2) NOT NULL,
  total_cost DECIMAL(14,2) NOT NULL,
  invoice_number TEXT,
  invoice_date DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage purchases" ON public.shop_purchases
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- WISHLIST
-- =============================================
CREATE TABLE public.shop_wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.shop_products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.shop_wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist" ON public.shop_wishlist
FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM public.shop_orders;
  new_number := 'SHP' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(counter::TEXT, 5, '0');
  RETURN new_number;
END;
$$;

-- Generate purchase number
CREATE OR REPLACE FUNCTION public.generate_purchase_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM public.shop_purchases;
  new_number := 'PUR' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(counter::TEXT, 5, '0');
  RETURN new_number;
END;
$$;

-- Generate SKU
CREATE OR REPLACE FUNCTION public.generate_sku(category_slug TEXT, brand_slug TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_sku TEXT;
  cat_prefix TEXT;
  brand_prefix TEXT;
  counter INTEGER;
BEGIN
  cat_prefix := UPPER(SUBSTRING(category_slug, 1, 3));
  brand_prefix := UPPER(SUBSTRING(COALESCE(brand_slug, 'GEN'), 1, 3));
  SELECT COUNT(*) + 1 INTO counter FROM public.shop_products;
  new_sku := cat_prefix || '-' || brand_prefix || '-' || LPAD(counter::TEXT, 5, '0');
  RETURN new_sku;
END;
$$;

-- Auto-create customer profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_shop_customer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.shop_customers (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger for new customer
DROP TRIGGER IF EXISTS on_auth_user_created_shop_customer ON auth.users;
CREATE TRIGGER on_auth_user_created_shop_customer
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_shop_customer();

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION public.update_shop_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_shop_categories_updated_at BEFORE UPDATE ON public.shop_categories
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

CREATE TRIGGER update_shop_brands_updated_at BEFORE UPDATE ON public.shop_brands
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

CREATE TRIGGER update_shop_vendors_updated_at BEFORE UPDATE ON public.shop_vendors
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

CREATE TRIGGER update_shop_products_updated_at BEFORE UPDATE ON public.shop_products
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

CREATE TRIGGER update_shop_customers_updated_at BEFORE UPDATE ON public.shop_customers
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

CREATE TRIGGER update_shop_cart_updated_at BEFORE UPDATE ON public.shop_cart
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

CREATE TRIGGER update_shop_orders_updated_at BEFORE UPDATE ON public.shop_orders
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

-- =============================================
-- SEED INITIAL CATEGORIES
-- =============================================
INSERT INTO public.shop_categories (name, slug, description, display_order, filter_config) VALUES
('Computers & Laptops', 'computers-laptops', 'Desktop computers, laptops, and workstations', 1, 
 '[{"key":"brand","label":"Brand","type":"select"},{"key":"processor","label":"Processor","type":"select","options":["Intel i3","Intel i5","Intel i7","Intel i9","AMD Ryzen 3","AMD Ryzen 5","AMD Ryzen 7","AMD Ryzen 9"]},{"key":"ram_size","label":"RAM Size","type":"select","options":["4GB","8GB","16GB","32GB","64GB"]},{"key":"storage_type","label":"Storage Type","type":"select","options":["HDD","SSD","NVMe SSD","Hybrid"]},{"key":"storage_capacity","label":"Storage Capacity","type":"select","options":["256GB","512GB","1TB","2TB"]},{"key":"os","label":"Operating System","type":"select","options":["Windows 11","Windows 10","Linux","DOS"]},{"key":"screen_size","label":"Screen Size","type":"select","options":["13 inch","14 inch","15.6 inch","17 inch"]},{"key":"usage_type","label":"Usage Type","type":"select","options":["Office","Gaming","Business","Creative"]}]'::jsonb),

('Computer Accessories', 'computer-accessories', 'Keyboards, mouse, RAM, storage, monitors and more', 2,
 '[{"key":"brand","label":"Brand","type":"select"},{"key":"accessory_type","label":"Accessory Type","type":"select","options":["Keyboard","Mouse","Monitor","RAM","HDD","SSD","Webcam","Speakers","Headset"]},{"key":"connectivity","label":"Connectivity","type":"select","options":["Wired","Wireless","Bluetooth","USB"]}]'::jsonb),

('CCTV & Surveillance', 'cctv-surveillance', 'Security cameras and surveillance systems', 3,
 '[{"key":"brand","label":"Brand","type":"select"},{"key":"camera_type","label":"Camera Type","type":"select","options":["IP Camera","Analog Camera","Wireless Camera","PTZ Camera"]},{"key":"megapixel","label":"Resolution (MP)","type":"select","options":["2MP","4MP","5MP","8MP","12MP"]},{"key":"location","label":"Location","type":"select","options":["Indoor","Outdoor","Indoor/Outdoor"]},{"key":"night_vision","label":"Night Vision","type":"select","options":["Yes","No","Color Night Vision"]},{"key":"lens_type","label":"Lens Type","type":"select","options":["Fixed","Varifocal","Motorized"]},{"key":"storage_type","label":"Storage Type","type":"select","options":["DVR","NVR","Cloud","SD Card"]},{"key":"power_type","label":"Power Type","type":"select","options":["PoE","12V DC","Battery","Solar"]},{"key":"weatherproof","label":"Weatherproof","type":"select","options":["IP65","IP66","IP67","None"]}]'::jsonb),

('CCTV Accessories', 'cctv-accessories', 'DVR, NVR, cables, power supplies, mounts', 4,
 '[{"key":"brand","label":"Brand","type":"select"},{"key":"accessory_type","label":"Type","type":"select","options":["DVR","NVR","SMPS","Cables","Connectors","Mounts","Hard Disk"]},{"key":"channel_count","label":"Channels","type":"select","options":["4 Channel","8 Channel","16 Channel","32 Channel"]}]'::jsonb),

('Networking Devices', 'networking-devices', 'Routers, switches, firewalls, access points', 5,
 '[{"key":"brand","label":"Brand","type":"select"},{"key":"device_type","label":"Device Type","type":"select","options":["Router","Switch","Firewall","Access Point","Modem"]},{"key":"port_count","label":"Port Count","type":"select","options":["4 Ports","8 Ports","16 Ports","24 Ports","48 Ports"]},{"key":"speed","label":"Speed","type":"select","options":["10/100 Mbps","Gigabit","10 Gigabit"]},{"key":"management","label":"Management","type":"select","options":["Managed","Unmanaged","Smart Managed"]},{"key":"poe_support","label":"PoE Support","type":"select","options":["Yes","No","PoE+"]},{"key":"rack_mount","label":"Rack Mountable","type":"select","options":["Yes","No"]}]'::jsonb),

('Networking Accessories', 'networking-accessories', 'Cables, racks, patch panels, tools', 6,
 '[{"key":"brand","label":"Brand","type":"select"},{"key":"accessory_type","label":"Type","type":"select","options":["Patch Cord","Patch Panel","Network Rack","Crimping Tool","Cable","SFP Module"]}]'::jsonb),

('Passive Networking', 'passive-networking', 'Structured cabling and passive components', 7,
 '[{"key":"brand","label":"Brand","type":"select"},{"key":"product_type","label":"Type","type":"select","options":["Cat5e Cable","Cat6 Cable","Cat6a Cable","Fiber Cable","Keystone Jack","Face Plate","Cable Tray"]}]'::jsonb),

('Servers', 'servers', 'Tower, rack, and blade servers', 8,
 '[{"key":"brand","label":"Brand","type":"select"},{"key":"server_type","label":"Server Type","type":"select","options":["Tower Server","Rack Server","Blade Server","Micro Server"]},{"key":"processor","label":"Processor","type":"select","options":["Intel Xeon Bronze","Intel Xeon Silver","Intel Xeon Gold","Intel Xeon Platinum","AMD EPYC"]},{"key":"ram_capacity","label":"RAM Capacity","type":"select","options":["16GB","32GB","64GB","128GB","256GB"]},{"key":"storage_bays","label":"Storage Bays","type":"select","options":["2 Bays","4 Bays","8 Bays","12 Bays","24 Bays"]},{"key":"raid_support","label":"RAID Support","type":"select","options":["RAID 0/1","RAID 5","RAID 6","RAID 10","All"]},{"key":"use_case","label":"Use Case","type":"select","options":["SMB","Enterprise","Data Center"]}]'::jsonb),

('Server Accessories', 'server-accessories', 'Server RAM, storage, rails, and components', 9,
 '[{"key":"brand","label":"Brand","type":"select"},{"key":"accessory_type","label":"Type","type":"select","options":["Server RAM","Server HDD","Server SSD","RAID Controller","Rail Kit","Power Supply","UPS"]}]'::jsonb);

-- Insert some sample brands
INSERT INTO public.shop_brands (name, slug) VALUES
('Hikvision', 'hikvision'),
('Dahua', 'dahua'),
('CP Plus', 'cp-plus'),
('TP-Link', 'tp-link'),
('Cisco', 'cisco'),
('D-Link', 'dlink'),
('HP', 'hp'),
('Dell', 'dell'),
('Lenovo', 'lenovo'),
('Asus', 'asus'),
('Acer', 'acer'),
('Seagate', 'seagate'),
('Western Digital', 'western-digital'),
('Samsung', 'samsung'),
('Intel', 'intel'),
('Ubiquiti', 'ubiquiti'),
('Netgear', 'netgear'),
('MikroTik', 'mikrotik');