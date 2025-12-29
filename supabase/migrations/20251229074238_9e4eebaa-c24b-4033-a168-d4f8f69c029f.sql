-- Create quotation status enum
CREATE TYPE public.quotation_status AS ENUM ('draft', 'sent', 'approved', 'rejected', 'converted');

-- Create quotations table
CREATE TABLE public.cctv_quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number TEXT NOT NULL UNIQUE,
    engineer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status quotation_status NOT NULL DEFAULT 'draft',
    cctv_system_type TEXT NOT NULL CHECK (cctv_system_type IN ('analog', 'ip', 'wifi')),
    
    -- Customer details
    customer_name TEXT NOT NULL,
    customer_mobile TEXT NOT NULL,
    customer_email TEXT,
    installation_address TEXT NOT NULL,
    city TEXT NOT NULL,
    gst_number TEXT,
    notes TEXT,
    
    -- Pricing
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount_percentage NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    tax_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    
    -- Metadata
    valid_until DATE,
    terms_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    sent_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Create quotation items table
CREATE TABLE public.cctv_quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES public.cctv_quotations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.shop_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    category_type TEXT NOT NULL,
    specifications JSONB DEFAULT '{}'::jsonb,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    notes TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CCTV product specifications definition table
CREATE TABLE public.cctv_spec_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_type TEXT NOT NULL,
    spec_key TEXT NOT NULL,
    spec_label TEXT NOT NULL,
    field_type TEXT NOT NULL DEFAULT 'select',
    options JSONB,
    is_required BOOLEAN DEFAULT false,
    is_filterable BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(category_type, spec_key)
);

-- Enable RLS
ALTER TABLE public.cctv_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cctv_quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cctv_spec_definitions ENABLE ROW LEVEL SECURITY;

-- Create helper function to check CCTV engineer role
CREATE OR REPLACE FUNCTION public.is_cctv_engineer(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role IN ('cctv_engineer', 'admin')
    )
$$;

-- RLS Policies for quotations
CREATE POLICY "Engineers can view own quotations"
ON public.cctv_quotations FOR SELECT
USING (engineer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Engineers can create quotations"
ON public.cctv_quotations FOR INSERT
WITH CHECK (is_cctv_engineer(auth.uid()) AND engineer_id = auth.uid());

CREATE POLICY "Engineers can update own quotations"
ON public.cctv_quotations FOR UPDATE
USING (engineer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Engineers can delete own draft quotations"
ON public.cctv_quotations FOR DELETE
USING ((engineer_id = auth.uid() AND status = 'draft') OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for quotation items
CREATE POLICY "Users can view quotation items"
ON public.cctv_quotation_items FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.cctv_quotations q
    WHERE q.id = quotation_id AND (q.engineer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
));

CREATE POLICY "Engineers can manage quotation items"
ON public.cctv_quotation_items FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.cctv_quotations q
    WHERE q.id = quotation_id AND (q.engineer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
));

-- RLS Policies for spec definitions
CREATE POLICY "Anyone can view spec definitions"
ON public.cctv_spec_definitions FOR SELECT
USING (true);

CREATE POLICY "Admins can manage spec definitions"
ON public.cctv_spec_definitions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create quotation number generator
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    SELECT COUNT(*) + 1 INTO counter FROM public.cctv_quotations;
    new_number := 'QT' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(counter::TEXT, 5, '0');
    RETURN new_number;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_cctv_quotations_updated_at
    BEFORE UPDATE ON public.cctv_quotations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_shop_updated_at();