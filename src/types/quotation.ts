export type CCTVSystemType = 'analog' | 'ip' | 'wifi';
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'converted';
export type CategoryType = 'camera' | 'dvr' | 'nvr' | 'hdd' | 'power' | 'enclosure' | 'display' | 'cabling';

export interface QuotationItem {
  id?: string;
  product_id: string | null;
  product_name: string;
  product_sku?: string | null;
  category_type: CategoryType;
  specifications: Record<string, string | boolean | number>;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  display_order?: number;
}

export interface CustomerDetails {
  customer_name: string;
  customer_mobile: string;
  customer_email?: string;
  installation_address: string;
  city: string;
  gst_number?: string;
  notes?: string;
}

export interface Quotation {
  id?: string;
  quotation_number?: string;
  engineer_id?: string;
  status: QuotationStatus;
  cctv_system_type: CCTVSystemType;
  customer_name: string;
  customer_mobile: string;
  customer_email?: string;
  installation_address: string;
  city: string;
  gst_number?: string;
  notes?: string;
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  valid_until?: string;
  terms_conditions?: string;
  created_at?: string;
  updated_at?: string;
  items?: QuotationItem[];
}

export interface SpecDefinition {
  id: string;
  category_type: CategoryType;
  spec_key: string;
  spec_label: string;
  field_type: 'select' | 'checkbox' | 'number' | 'text';
  options?: string[];
  is_required: boolean;
  is_filterable: boolean;
  display_order: number;
}

export interface ProductFilters {
  cctv_system_type?: CCTVSystemType;
  category_type?: CategoryType;
  brand_id?: string;
  [key: string]: string | boolean | undefined;
}

export interface WizardStep {
  id: number;
  key: string;
  title: string;
  categoryType?: CategoryType;
  description: string;
  isConditional?: boolean;
  condition?: (systemType: CCTVSystemType) => boolean;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    key: 'system_type',
    title: 'CCTV System Type',
    description: 'Select the type of CCTV system',
  },
  {
    id: 2,
    key: 'camera',
    title: 'Camera Selection',
    categoryType: 'camera',
    description: 'Choose cameras with specifications',
  },
  {
    id: 3,
    key: 'recorder',
    title: 'DVR / NVR Selection',
    description: 'Select recording device',
    isConditional: true,
    condition: (type) => type !== 'wifi',
  },
  {
    id: 4,
    key: 'storage',
    title: 'Hard Disk Selection',
    categoryType: 'hdd',
    description: 'Choose storage capacity',
  },
  {
    id: 5,
    key: 'power',
    title: 'Power & Backup',
    categoryType: 'power',
    description: 'Select UPS and power supply',
  },
  {
    id: 6,
    key: 'enclosure',
    title: 'Enclosures & Accessories',
    categoryType: 'enclosure',
    description: 'Choose enclosures and boxes',
  },
  {
    id: 7,
    key: 'display',
    title: 'Display & Viewing',
    categoryType: 'display',
    description: 'Select monitors',
  },
  {
    id: 8,
    key: 'cabling',
    title: 'Cabling & Connectors',
    categoryType: 'cabling',
    description: 'Choose cables and connectors',
  },
  {
    id: 9,
    key: 'customer',
    title: 'Customer Details',
    description: 'Enter customer information',
  },
];
