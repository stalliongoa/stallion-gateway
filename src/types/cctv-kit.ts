export type KitType = 'analog' | 'ip' | 'wifi';
export type ChannelCapacity = 4 | 8 | 16;
export type CameraResolution = '2MP' | '4MP' | '5MP';
export type KitStatus = 'active' | 'inactive';

export interface CCTVKit {
  id: string;
  name: string;
  slug: string;
  kit_type: KitType;
  channel_capacity: ChannelCapacity;
  camera_resolution: CameraResolution;
  brand_id: string | null;
  status: KitStatus;
  total_purchase_cost: number;
  selling_price: number;
  profit_amount: number;
  profit_percentage: number;
  image_url: string | null;
  short_highlights: string[] | null;
  long_description: string | null;
  has_free_wifi_camera: boolean;
  free_wifi_camera_product_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  brand?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  items?: CCTVKitItem[];
}

export interface CCTVKitItem {
  id: string;
  kit_id: string;
  product_id: string | null;
  product_type: ProductType;
  product_name: string;
  quantity: number;
  unit_type: 'pieces' | 'meters' | null;
  purchase_price: number;
  selling_price: number;
  is_free_item: boolean;
  display_order: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    sku: string | null;
    images: string[] | null;
    purchase_price: number | null;
    selling_price: number | null;
  };
}

export type ProductType = 
  | 'camera'
  | 'dvr'
  | 'nvr'
  | 'smps'
  | 'hard_drive'
  | 'cable'
  | 'monitor'
  | 'ups'
  | 'rack'
  | 'accessory'
  | 'wifi_camera';

export interface CCTVKitPricingHistory {
  id: string;
  kit_id: string;
  total_purchase_cost: number;
  selling_price: number;
  profit_amount: number;
  profit_percentage: number;
  changed_by: string | null;
  changed_at: string;
  notes: string | null;
}

export interface KitWizardData {
  // Step 1: Basic Details
  name: string;
  kit_type: KitType;
  channel_capacity: ChannelCapacity;
  camera_resolution: CameraResolution;
  brand_id: string | null;
  status: KitStatus;
  
  // Step 2-10: Items
  items: KitItemSelection[];
  
  // Step 11: Optional Offer
  has_free_wifi_camera: boolean;
  free_wifi_camera_product_id: string | null;
  
  // Step 12: Pricing
  selling_price: number;
  
  // Step 13: Media
  image_url: string | null;
  short_highlights: string[];
  long_description: string;
}

export interface KitItemSelection {
  product_type: ProductType;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_type: 'pieces' | 'meters' | null;
  purchase_price: number;
  selling_price: number;
  is_free_item: boolean;
}

export const KIT_WIZARD_STEPS = [
  { id: 1, title: 'Basic Details', description: 'Kit name, type, and brand' },
  { id: 2, title: 'Camera Selection', description: 'Select cameras for the kit' },
  { id: 3, title: 'DVR Selection', description: 'Select recording device' },
  { id: 4, title: 'Power Supply', description: 'SMPS selection' },
  { id: 5, title: 'Hard Disk', description: 'Storage selection' },
  { id: 6, title: 'CCTV Cable', description: 'Cable requirements' },
  { id: 7, title: 'Monitor', description: 'Display selection' },
  { id: 8, title: 'UPS', description: 'Power backup' },
  { id: 9, title: 'Rack/Enclosure', description: 'Housing selection' },
  { id: 10, title: 'Accessories', description: 'Connectors and extras' },
  { id: 11, title: 'Optional Offer', description: 'Free WiFi camera promo' },
  { id: 12, title: 'Pricing', description: 'Cost and profit calculation' },
  { id: 13, title: 'Media & Content', description: 'Images and description' },
  { id: 14, title: 'Review & Save', description: 'Final review' },
] as const;

export const CHANNEL_DEFAULTS = {
  4: {
    cameras: 4,
    cableMeters: 90,
    suggestedHDD: '1TB',
    suggestedMonitor: '19"',
  },
  8: {
    cameras: 8,
    cableMeters: 180,
    suggestedHDD: '2TB',
    suggestedMonitor: '19"',
  },
  16: {
    cameras: 16,
    cableMeters: 360,
    suggestedHDD: '4TB',
    suggestedMonitor: '22"',
  },
} as const;
