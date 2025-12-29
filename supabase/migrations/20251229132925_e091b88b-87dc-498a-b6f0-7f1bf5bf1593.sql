-- Add model_number to products table
ALTER TABLE public.shop_products
ADD COLUMN IF NOT EXISTS model_number text;

-- Add reserved_stock to products
ALTER TABLE public.shop_products
ADD COLUMN IF NOT EXISTS reserved_stock integer DEFAULT 0;

-- Add minimum_stock_level and reorder_quantity
ALTER TABLE public.shop_products
ADD COLUMN IF NOT EXISTS minimum_stock_level integer DEFAULT 5;

ALTER TABLE public.shop_products
ADD COLUMN IF NOT EXISTS reorder_quantity integer DEFAULT 10;

-- Add last_purchase_price
ALTER TABLE public.shop_products
ADD COLUMN IF NOT EXISTS last_purchase_price numeric;

-- Add soft delete column
ALTER TABLE public.shop_products
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- Add inventory_manager role to enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'inventory_manager';

-- Create stock_movements table for audit trail
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE RESTRICT,
  action_type text NOT NULL CHECK (action_type IN ('purchase', 'sale', 'quotation_reserved', 'quotation_released', 'adjustment', 'transfer', 'return')),
  quantity_change integer NOT NULL,
  quantity_before integer NOT NULL,
  quantity_after integer NOT NULL,
  reference_type text CHECK (reference_type IN ('purchase', 'order', 'quotation', 'adjustment', 'transfer')),
  reference_id uuid,
  reason text,
  notes text,
  attachment_url text,
  user_id uuid REFERENCES auth.users(id),
  warehouse_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create quotation_reservations table
CREATE TABLE IF NOT EXISTS public.quotation_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.cctv_quotations(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  reserved_at timestamp with time zone NOT NULL DEFAULT now(),
  released_at timestamp with time zone,
  status text NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'converted', 'released', 'expired')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create warehouses table (future-ready)
CREATE TABLE IF NOT EXISTS public.warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  address text,
  city text,
  state text,
  pincode text,
  contact_person text,
  phone text,
  email text,
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create warehouse_stock table for multi-warehouse tracking
CREATE TABLE IF NOT EXISTS public.warehouse_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reserved_quantity integer NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(warehouse_id, product_id)
);

-- Create stock_adjustments table
CREATE TABLE IF NOT EXISTS public.stock_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE RESTRICT,
  adjustment_type text NOT NULL CHECK (adjustment_type IN ('add', 'remove')),
  quantity integer NOT NULL CHECK (quantity > 0),
  reason text NOT NULL CHECK (reason IN ('damage', 'loss', 'correction', 'expired', 'found', 'initial_stock', 'other')),
  notes text,
  attachment_url text,
  adjusted_by uuid REFERENCES auth.users(id),
  warehouse_id uuid REFERENCES public.warehouses(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add invoice_url to purchases
ALTER TABLE public.shop_purchases
ADD COLUMN IF NOT EXISTS invoice_url text;

-- Add payment_status to purchases
ALTER TABLE public.shop_purchases
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- Add purchase_date to purchases
ALTER TABLE public.shop_purchases
ADD COLUMN IF NOT EXISTS purchase_date date DEFAULT CURRENT_DATE;

-- Add GST fields to purchases
ALTER TABLE public.shop_purchases
ADD COLUMN IF NOT EXISTS gst_rate numeric DEFAULT 18;

ALTER TABLE public.shop_purchases
ADD COLUMN IF NOT EXISTS gst_amount numeric DEFAULT 0;

-- Create low_stock_alerts table
CREATE TABLE IF NOT EXISTS public.low_stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE CASCADE,
  current_stock integer NOT NULL,
  minimum_level integer NOT NULL,
  alert_type text NOT NULL DEFAULT 'low_stock' CHECK (alert_type IN ('low_stock', 'out_of_stock', 'reorder')),
  is_acknowledged boolean DEFAULT false,
  acknowledged_by uuid REFERENCES auth.users(id),
  acknowledged_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.low_stock_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stock_movements
CREATE POLICY "Admins can view stock movements"
ON public.stock_movements FOR SELECT
USING (has_role(auth.uid(), 'admin') OR is_cctv_engineer(auth.uid()));

CREATE POLICY "Admins can insert stock movements"
ON public.stock_movements FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS for quotation_reservations
CREATE POLICY "Admins can manage reservations"
ON public.quotation_reservations FOR ALL
USING (has_role(auth.uid(), 'admin') OR is_cctv_engineer(auth.uid()));

-- RLS for warehouses
CREATE POLICY "Anyone can view warehouses"
ON public.warehouses FOR SELECT
USING (true);

CREATE POLICY "Admins can manage warehouses"
ON public.warehouses FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS for warehouse_stock
CREATE POLICY "Admins can view warehouse stock"
ON public.warehouse_stock FOR SELECT
USING (has_role(auth.uid(), 'admin') OR is_cctv_engineer(auth.uid()));

CREATE POLICY "Admins can manage warehouse stock"
ON public.warehouse_stock FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS for stock_adjustments
CREATE POLICY "Admins can manage adjustments"
ON public.stock_adjustments FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Engineers can view adjustments"
ON public.stock_adjustments FOR SELECT
USING (is_cctv_engineer(auth.uid()));

-- RLS for low_stock_alerts
CREATE POLICY "Admins can manage alerts"
ON public.low_stock_alerts FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Engineers can view alerts"
ON public.low_stock_alerts FOR SELECT
USING (is_cctv_engineer(auth.uid()));

-- Create triggers to update updated_at
CREATE TRIGGER update_quotation_reservations_updated_at
BEFORE UPDATE ON public.quotation_reservations
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

CREATE TRIGGER update_warehouses_updated_at
BEFORE UPDATE ON public.warehouses
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

CREATE TRIGGER update_warehouse_stock_updated_at
BEFORE UPDATE ON public.warehouse_stock
FOR EACH ROW EXECUTE FUNCTION public.update_shop_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON public.stock_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_action ON public.stock_movements(action_type);
CREATE INDEX IF NOT EXISTS idx_quotation_reservations_quotation ON public.quotation_reservations(quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotation_reservations_product ON public.quotation_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_product ON public.low_stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_products_model_number ON public.shop_products(model_number);
CREATE INDEX IF NOT EXISTS idx_products_deleted ON public.shop_products(deleted_at) WHERE deleted_at IS NULL;

-- Insert default warehouse
INSERT INTO public.warehouses (name, code, is_default)
VALUES ('Main Warehouse', 'MAIN', true)
ON CONFLICT DO NOTHING;