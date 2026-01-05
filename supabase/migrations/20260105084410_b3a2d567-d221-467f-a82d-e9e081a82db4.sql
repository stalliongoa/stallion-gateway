-- CCTV Kits Master Table
CREATE TABLE public.cctv_kits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  kit_type TEXT NOT NULL DEFAULT 'analog', -- analog, ip, wifi
  channel_capacity INTEGER NOT NULL, -- 4, 8, 16
  camera_resolution TEXT NOT NULL, -- 2MP, 4MP, 5MP
  brand_id UUID REFERENCES public.shop_brands(id),
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive
  total_purchase_cost NUMERIC NOT NULL DEFAULT 0,
  selling_price NUMERIC NOT NULL DEFAULT 0,
  profit_amount NUMERIC NOT NULL DEFAULT 0,
  profit_percentage NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  short_highlights TEXT[], -- bullet points
  long_description TEXT,
  has_free_wifi_camera BOOLEAN DEFAULT false,
  free_wifi_camera_product_id UUID REFERENCES public.shop_products(id),
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CCTV Kit Items Table
CREATE TABLE public.cctv_kit_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kit_id UUID NOT NULL REFERENCES public.cctv_kits(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.shop_products(id),
  product_type TEXT NOT NULL, -- camera, dvr, smps, hard_drive, cable, monitor, ups, rack, accessory
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_type TEXT, -- pieces, meters
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  selling_price NUMERIC NOT NULL DEFAULT 0,
  is_free_item BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CCTV Kit Pricing History Table
CREATE TABLE public.cctv_kit_pricing_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kit_id UUID NOT NULL REFERENCES public.cctv_kits(id) ON DELETE CASCADE,
  total_purchase_cost NUMERIC NOT NULL,
  selling_price NUMERIC NOT NULL,
  profit_amount NUMERIC NOT NULL,
  profit_percentage NUMERIC NOT NULL,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.cctv_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cctv_kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cctv_kit_pricing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cctv_kits
CREATE POLICY "Active kits viewable by everyone" 
ON public.cctv_kits 
FOR SELECT 
USING (status = 'active' OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'inventory_manager'::app_role));

CREATE POLICY "Admins and inventory managers can manage kits" 
ON public.cctv_kits 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'inventory_manager'::app_role));

-- RLS Policies for cctv_kit_items
CREATE POLICY "Kit items viewable with kit access" 
ON public.cctv_kit_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cctv_kits k 
  WHERE k.id = cctv_kit_items.kit_id 
  AND (k.status = 'active' OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'inventory_manager'::app_role))
));

CREATE POLICY "Admins and inventory managers can manage kit items" 
ON public.cctv_kit_items 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'inventory_manager'::app_role));

-- RLS Policies for pricing history
CREATE POLICY "Admins and inventory managers can view pricing history" 
ON public.cctv_kit_pricing_history 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'inventory_manager'::app_role));

CREATE POLICY "Admins and inventory managers can insert pricing history" 
ON public.cctv_kit_pricing_history 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'inventory_manager'::app_role));

-- Create indexes
CREATE INDEX idx_cctv_kits_status ON public.cctv_kits(status);
CREATE INDEX idx_cctv_kits_kit_type ON public.cctv_kits(kit_type);
CREATE INDEX idx_cctv_kits_brand_id ON public.cctv_kits(brand_id);
CREATE INDEX idx_cctv_kit_items_kit_id ON public.cctv_kit_items(kit_id);

-- Trigger for updated_at
CREATE TRIGGER update_cctv_kits_updated_at
BEFORE UPDATE ON public.cctv_kits
FOR EACH ROW
EXECUTE FUNCTION public.update_shop_updated_at();