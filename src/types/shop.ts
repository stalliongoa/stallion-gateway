export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  filter_config: FilterConfig[];
  created_at: string;
  updated_at: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'range' | 'checkbox';
  options?: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  website: string | null;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  barcode: string | null;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  brand_id: string | null;
  vendor_id: string | null;
  mrp: number | null;
  selling_price: number | null;
  purchase_price: number | null;
  cost_price: number | null;
  tax_rate: number;
  hsn_code: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  weight_kg: number | null;
  dimensions_cm: string | null;
  warranty_months: number | null;
  datasheet_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  specifications: Record<string, string>;
  images: string[];
  tags: string[];
  shopify_product_id: string | null;
  shopify_variant_id: string | null;
  shopify_sync_enabled: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  brand?: Brand;
}

export interface Vendor {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  pincode: string | null;
  gst_number: string | null;
  payment_terms: string | null;
  notes: string | null;
  is_active: boolean;
}

export interface Customer {
  id: string;
  user_id: string;
  company_name: string | null;
  gst_number: string | null;
  phone: string | null;
  billing_address: Address | null;
  shipping_address: Address | null;
  customer_type: 'retail' | 'wholesale' | 'dealer';
  status: 'pending' | 'approved' | 'blocked';
  total_orders: number;
  total_spent: number;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_id: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  billing_address: Address | null;
  shipping_address: Address | null;
  notes: string | null;
  admin_notes: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  tax_rate: number | null;
  tax_amount: number | null;
  total_price: number;
}

export interface Purchase {
  id: string;
  purchase_number: string;
  vendor_id: string | null;
  product_id: string | null;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  invoice_number: string | null;
  invoice_date: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  vendor?: Vendor;
  product?: Product;
}

export interface FilterState {
  [key: string]: string | string[] | [number, number];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  specifications?: Record<string, string>;
  search?: string;
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest';
}
