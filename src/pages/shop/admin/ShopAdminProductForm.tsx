import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, AlertCircle, Sparkles, Loader2, Link as LinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';
import CCTVCameraFields, { CCTVSpecs, defaultCCTVSpecs, validateCCTVSpecs } from '@/components/admin/CCTVCameraFields';
import { DVRFields, validateDVRSpecs } from '@/components/admin/DVRFields';
import { NVRFields, validateNVRSpecs } from '@/components/admin/NVRFields';
import { HDDFields, validateHDDSpecs } from '@/components/admin/HDDFields';
import { UPSFields, validateUPSSpecs } from '@/components/admin/UPSFields';
import { CableFields, validateCableSpecs } from '@/components/admin/CableFields';
import { RackFields, validateRackSpecs } from '@/components/admin/RackFields';
import { PoESwitchFields, validatePoESwitchSpecs } from '@/components/admin/PoESwitchFields';
import { BNCConnectorFields, validateBNCConnectorSpecs } from '@/components/admin/BNCConnectorFields';
import RJ45ConnectorFields, { validateRJ45ConnectorSpecs } from '@/components/admin/RJ45ConnectorFields';
import DCPinFields, { validateDCPinSpecs } from '@/components/admin/DCPinFields';
import VideoBalunFields, { validateVideoBalunSpecs } from '@/components/admin/VideoBalunFields';
import HDMICableFields, { validateHDMICableSpecs } from '@/components/admin/HDMICableFields';
import HDMISplitterFields, { validateHDMISplitterSpecs } from '@/components/admin/HDMISplitterFields';
import LANToHDMIConverterFields, { validateLANToHDMIConverterSpecs } from '@/components/admin/LANToHDMIConverterFields';
import LANToUSBConverterFields, { validateLANToUSBConverterSpecs } from '@/components/admin/LANToUSBConverterFields';
import SMPSFields, { validateSMPSSpecs } from '@/components/admin/SMPSFields';
import WiFiCameraFields, { WiFiCameraSpecs, defaultWiFiCameraSpecs, validateWiFiCameraSpecs } from '@/components/admin/WiFiCameraFields';

const PRODUCT_TYPES = [
  { value: 'general', label: 'General Product' },
  { value: 'cctv_camera', label: 'CCTV Camera' },
  { value: 'wifi_camera', label: 'WiFi Camera' },
  { value: 'dvr', label: 'DVR' },
  { value: 'nvr', label: 'NVR' },
  { value: 'hdd', label: 'Hard Disk Drive' },
  { value: 'ups', label: 'UPS' },
  { value: 'smps', label: 'SMPS (Power Supply)' },
  { value: 'cables', label: 'Cables & Connectors' },
  { value: 'rack', label: 'Rack' },
  { value: 'poe_switch', label: 'PoE Switch' },
  { value: 'bnc_connector', label: 'BNC Connector' },
  { value: 'rj45_connector', label: 'RJ45 Connector' },
  { value: 'dc_pin', label: 'DC Pin' },
  { value: 'video_balun', label: 'Video Balun' },
  { value: 'hdmi_cable', label: 'HDMI Cable' },
  { value: 'hdmi_splitter', label: 'HDMI Splitter' },
  { value: 'lan_to_hdmi', label: 'LAN to HDMI Converter' },
  { value: 'lan_to_usb', label: 'LAN to USB Converter' },
  { value: 'accessories', label: 'Accessories' },
];

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Vendor {
  id: string;
  name: string;
}

export default function ShopAdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const [productType, setProductType] = useState('general');
  const [cctvSpecs, setCctvSpecs] = useState<CCTVSpecs>(defaultCCTVSpecs);
  const [dvrSpecs, setDvrSpecs] = useState<Record<string, any>>({
    cctv_system_type: 'analog',
    allow_in_quotation: true,
  });
  const [nvrSpecs, setNvrSpecs] = useState<Record<string, any>>({
    cctv_system_type: 'ip',
    allow_in_quotation: true,
  });
  const [hddSpecs, setHddSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [upsSpecs, setUpsSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [cableSpecs, setCableSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [rackSpecs, setRackSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [poeSwitchSpecs, setPoeSwitchSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [bncConnectorSpecs, setBncConnectorSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [rj45ConnectorSpecs, setRj45ConnectorSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [dcPinSpecs, setDcPinSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [videoBalunSpecs, setVideoBalunSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [hdmiCableSpecs, setHdmiCableSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [hdmiSplitterSpecs, setHdmiSplitterSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [lanToHdmiSpecs, setLanToHdmiSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [lanToUsbSpecs, setLanToUsbSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [smpsSpecs, setSmpsSpecs] = useState<Record<string, any>>({
    allow_in_quotation: true,
  });
  const [wifiCameraSpecs, setWifiCameraSpecs] = useState<WiFiCameraSpecs>(defaultWiFiCameraSpecs);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // AI URL extraction
  const [productUrl, setProductUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    model_number: '',
    barcode: '',
    short_description: '',
    description: '',
    category_id: '',
    brand_id: '',
    vendor_id: '',
    mrp: '',
    selling_price: '',
    purchase_price: '',
    cost_price: '',
    tax_rate: '18',
    hsn_code: '',
    stock_quantity: '0',
    low_stock_threshold: '5',
    minimum_stock_level: '5',
    reorder_quantity: '10',
    weight_kg: '',
    dimensions_cm: '',
    warranty_months: '',
    datasheet_url: '',
    meta_title: '',
    meta_description: '',
    is_active: true,
    is_featured: false,
    shopify_sync_enabled: false,
    images: [] as string[],
    specifications: {} as Record<string, string>,
    tags: [] as string[],
  });

  useEffect(() => {
    fetchOptions();
    if (isEdit && id) {
      fetchProduct(id);
    }
  }, [id, isEdit]);

  const fetchOptions = async () => {
    const [{ data: cats }, { data: brnds }, { data: vndrs }] = await Promise.all([
      supabase.from('shop_categories').select('id, name, slug').eq('is_active', true).order('name'),
      supabase.from('shop_brands').select('id, name, slug').eq('is_active', true).order('name'),
      supabase.from('shop_vendors').select('id, name').eq('is_active', true).order('name'),
    ]);

    if (cats) setCategories(cats);
    if (brnds) setBrands(brnds);
    if (vndrs) setVendors(vndrs);
  };

  const fetchProduct = async (productId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('shop_products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      toast({ title: 'Error fetching product', description: error.message, variant: 'destructive' });
      navigate('/shop/admin/products');
    } else if (data) {
      const specs = (data.specifications as Record<string, unknown>) || {};
      
      // Check if this is a CCTV camera by checking stored product_type
      if (specs.product_type === 'cctv_camera') {
        setProductType('cctv_camera');
        setCctvSpecs({
          cctv_system_type: (specs.cctv_system_type as string) || '',
          camera_type: (specs.camera_type as string) || '',
          indoor_outdoor: (specs.indoor_outdoor as string) || '',
          resolution: (specs.resolution as string) || '',
          megapixel: (specs.megapixel as string) || '',
          lens_type: (specs.lens_type as string) || '',
          lens_size: (specs.lens_size as string) || '',
          frame_rate: (specs.frame_rate as string) || '',
          ir_support: Boolean(specs.ir_support),
          ir_range: (specs.ir_range as string) || '',
          night_vision: Boolean(specs.night_vision),
          bw_night_vision: Boolean(specs.bw_night_vision),
          color_night_vision: Boolean(specs.color_night_vision),
          audio_support: Boolean(specs.audio_support),
          audio_type: (specs.audio_type as string) || '',
          motion_detection: Boolean(specs.motion_detection),
          human_detection: Boolean(specs.human_detection),
          ai_features: (specs.ai_features as string[]) || [],
          body_material: (specs.body_material as string) || '',
          color: (specs.color as string) || '',
          weatherproof_rating: (specs.weatherproof_rating as string) || '',
          vertical_rotation: Boolean(specs.vertical_rotation),
          horizontal_rotation: Boolean(specs.horizontal_rotation),
          power_type: (specs.power_type as string) || '',
          connector_type: (specs.connector_type as string) || '',
          onboard_storage: Boolean(specs.onboard_storage),
          sd_card_support: (specs.sd_card_support as string) || '',
          compatible_with: (specs.compatible_with as string[]) || [],
          supported_dvr_nvr_resolution: (specs.supported_dvr_nvr_resolution as string) || '',
          warranty_period: (specs.warranty_period as string) || '',
          warranty_type: (specs.warranty_type as string) || '',
          installation_manual_url: (specs.installation_manual_url as string) || '',
          show_in_store: specs.show_in_store !== false,
          allow_in_quotation_builder: specs.allow_in_quotation_builder !== false,
        });
      } else if (specs.product_type === 'dvr') {
        setProductType('dvr');
        setDvrSpecs({
          cctv_system_type: 'analog',
          channel_capacity: specs.channel_capacity as string || '',
          supported_camera_resolution: (specs.supported_camera_resolution as string[]) || [],
          recording_resolution: specs.recording_resolution as string || '',
          sata_ports: specs.sata_ports as string || '',
          max_hdd_capacity: specs.max_hdd_capacity as string || '',
          supported_hdd_type: specs.supported_hdd_type as string || '',
          power_supply_type: specs.power_supply_type as string || '',
          power_input: specs.power_input as string || '12V DC',
          video_input_type: (specs.video_input_type as string[]) || [],
          video_output_ports: (specs.video_output_ports as string[]) || [],
          audio_input: Boolean(specs.audio_input),
          audio_output: Boolean(specs.audio_output),
          audio_channels: specs.audio_channels as string || '',
          lan_port: specs.lan_port as string || '',
          remote_viewing: Boolean(specs.remote_viewing),
          mobile_app: specs.mobile_app as string || '',
          ai_features: (specs.ai_features as string[]) || [],
          body_material: specs.body_material as string || '',
          cooling_fan: Boolean(specs.cooling_fan),
          warranty_period: specs.warranty_period as string || '',
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'nvr') {
        setProductType('nvr');
        setNvrSpecs({
          cctv_system_type: 'ip',
          channel_capacity: specs.channel_capacity as string || '',
          supported_camera_resolution: (specs.supported_camera_resolution as string[]) || [],
          incoming_bandwidth: specs.incoming_bandwidth as string || '',
          sata_ports: specs.sata_ports as string || '',
          max_hdd_capacity: specs.max_hdd_capacity as string || '',
          raid_support: Boolean(specs.raid_support),
          poe_ports: specs.poe_ports as string || '',
          poe_standard: specs.poe_standard as string || '',
          lan_ports: specs.lan_ports as string || '',
          video_output_ports: (specs.video_output_ports as string[]) || [],
          audio_input: Boolean(specs.audio_input),
          audio_output: Boolean(specs.audio_output),
          ai_features: (specs.ai_features as string[]) || [],
          onvif_support: Boolean(specs.onvif_support),
          mobile_app: specs.mobile_app as string || '',
          body_material: specs.body_material as string || '',
          cooling_fan: Boolean(specs.cooling_fan),
          warranty_period: specs.warranty_period as string || '',
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'hdd') {
        setProductType('hdd');
        setHddSpecs({
          storage_capacity: specs.storage_capacity as string || '',
          hdd_type: specs.hdd_type as string || '',
          rpm: specs.rpm as string || '',
          cache_memory: specs.cache_memory as string || '',
          compatible_with: (specs.compatible_with as string[]) || [],
          max_cameras: specs.max_cameras as string || '',
          interface_type: specs.interface_type as string || '',
          power_consumption: specs.power_consumption as string || '',
          operation_24x7: Boolean(specs.operation_24x7),
          workload_rating: specs.workload_rating as string || '',
          warranty_period: specs.warranty_period as string || '',
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'ups') {
        setProductType('ups');
        setUpsSpecs({
          ups_type: specs.ups_type as string || '',
          capacity_va: specs.capacity_va as string || '',
          output_power_watts: specs.output_power_watts as string || '',
          backup_time: specs.backup_time as string || '',
          battery_type: specs.battery_type as string || '',
          battery_count: specs.battery_count as string || '',
          input_voltage_range: specs.input_voltage_range as string || '',
          output_voltage: specs.output_voltage as string || '230V AC',
          socket_type: specs.socket_type as string || '',
          recommended_for: (specs.recommended_for as string[]) || [],
          max_load_watts: specs.max_load_watts as string || '',
          warranty_period: specs.warranty_period as string || '',
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'cables') {
        setProductType('cables');
        setCableSpecs({
          cable_category: specs.cable_category as string || '',
          model_number: specs.model_number as string || '',
          cable_type: specs.cable_type as string || '',
          length: specs.length as string || '',
          conductor_material: specs.conductor_material as string || '',
          shielding: specs.shielding as string || '',
          compatible_with: (specs.compatible_with as string[]) || [],
          warranty_period: specs.warranty_period as string || '',
          datasheet_url: specs.datasheet_url as string || '',
          is_active: specs.is_active !== false,
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'rack') {
        setProductType('rack');
        setRackSpecs({
          rack_type: specs.rack_type as string || '',
          size_u: specs.size_u as string || '',
          material: specs.material as string || '',
          compatible_with: (specs.compatible_with as string[]) || [],
          warranty_period: specs.warranty_period as string || '',
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'poe_switch') {
        setProductType('poe_switch');
        setPoeSwitchSpecs({
          model: specs.model as string || '',
          total_ports: specs.total_ports as string || '',
          poe_ports: specs.poe_ports as string || '',
          poe_standard: specs.poe_standard as string || '',
          is_managed: specs.is_managed as string || '',
          total_poe_power: specs.total_poe_power as string || '',
          uplink_ports: specs.uplink_ports as string || '',
          warranty_period: specs.warranty_period as string || '',
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'bnc_connector') {
        setProductType('bnc_connector');
        setBncConnectorSpecs({
          connector_type: specs.connector_type as string || '',
          material: specs.material as string || '',
          compatible_cable: specs.compatible_cable as string || '',
          pack_size: specs.pack_size as string || '',
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'rj45_connector') {
        setProductType('rj45_connector');
        setRj45ConnectorSpecs({
          cable_category: specs.cable_category as string || '',
          connector_type: specs.connector_type as string || '',
          pack_size: specs.pack_size || 0,
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'dc_pin') {
        setProductType('dc_pin');
        setDcPinSpecs({
          pin_type: specs.pin_type as string || '',
          voltage_rating: specs.voltage_rating as string || '',
          pack_size: specs.pack_size || 0,
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'video_balun') {
        setProductType('video_balun');
        setVideoBalunSpecs({
          balun_type: specs.balun_type as string || '',
          distance_supported: specs.distance_supported as string || '',
          compatible_cable: specs.compatible_cable as string || '',
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'hdmi_cable') {
        setProductType('hdmi_cable');
        setHdmiCableSpecs({
          hdmi_version: specs.hdmi_version as string || '',
          cable_length: specs.cable_length as string || '',
          support_4k: Boolean(specs.support_4k),
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'hdmi_splitter') {
        setProductType('hdmi_splitter');
        setHdmiSplitterSpecs({
          input_ports: specs.input_ports || 0,
          output_ports: specs.output_ports || 0,
          support_4k: Boolean(specs.support_4k),
          power_adapter_included: Boolean(specs.power_adapter_included),
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'lan_to_hdmi') {
        setProductType('lan_to_hdmi');
        setLanToHdmiSpecs({
          max_distance: specs.max_distance as string || '',
          resolution_support: specs.resolution_support as string || '',
          power_supply: specs.power_supply as string || '',
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'lan_to_usb') {
        setProductType('lan_to_usb');
        setLanToUsbSpecs({
          supported_device: specs.supported_device as string || '',
          driver_required: Boolean(specs.driver_required),
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'smps') {
        setProductType('smps');
        setSmpsSpecs({
          channels: specs.channels as string || '',
          output_voltage: specs.output_voltage as string || '',
          amperage: specs.amperage as string || '',
          metal_body: Boolean(specs.metal_body),
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type === 'wifi_camera') {
        setProductType('wifi_camera');
        setWifiCameraSpecs({
          wifi_camera_type: (specs.wifi_camera_type as string) || '',
          indoor_outdoor: (specs.indoor_outdoor as string) || '',
          resolution: (specs.resolution as string) || '',
          megapixel: (specs.megapixel as string) || '',
          lens_type: (specs.lens_type as string) || '',
          field_of_view: (specs.field_of_view as string) || '',
          frame_rate: (specs.frame_rate as string) || '',
          night_vision: Boolean(specs.night_vision),
          night_vision_type: (specs.night_vision_type as string) || '',
          ir_range: (specs.ir_range as string) || '',
          pan_support: Boolean(specs.pan_support),
          tilt_support: Boolean(specs.tilt_support),
          zoom_support: (specs.zoom_support as string) || '',
          pan_range: (specs.pan_range as string) || '',
          tilt_range: (specs.tilt_range as string) || '',
          two_way_audio: Boolean(specs.two_way_audio),
          built_in_mic_speaker: Boolean(specs.built_in_mic_speaker),
          motion_detection: Boolean(specs.motion_detection),
          human_detection: Boolean(specs.human_detection),
          ai_features: (specs.ai_features as string[]) || [],
          wifi_band: (specs.wifi_band as string) || '',
          lan_port: Boolean(specs.lan_port),
          mobile_app: (specs.mobile_app as string) || '',
          cloud_storage: Boolean(specs.cloud_storage),
          sd_card_support: (specs.sd_card_support as string) || '',
          power_type: (specs.power_type as string) || '',
          battery_capacity: (specs.battery_capacity as string) || '',
          solar_panel_included: Boolean(specs.solar_panel_included),
          body_material: (specs.body_material as string) || '',
          weatherproof_rating: (specs.weatherproof_rating as string) || '',
          color: (specs.color as string) || '',
          recording_modes: (specs.recording_modes as string[]) || [],
          warranty_period: (specs.warranty_period as string) || '',
          datasheet_url: (specs.datasheet_url as string) || '',
          manual_url: (specs.manual_url as string) || '',
          video_url: (specs.video_url as string) || '',
          show_in_store: specs.show_in_store !== false,
          allow_in_quotation: specs.allow_in_quotation !== false,
        });
      } else if (specs.product_type) {
        setProductType(specs.product_type as string);
      }
      
      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        sku: data.sku || '',
        model_number: (data as any).model_number || '',
        barcode: data.barcode || '',
        short_description: data.short_description || '',
        description: data.description || '',
        category_id: data.category_id || '',
        brand_id: data.brand_id || '',
        vendor_id: data.vendor_id || '',
        mrp: data.mrp?.toString() || '',
        selling_price: data.selling_price?.toString() || '',
        purchase_price: data.purchase_price?.toString() || '',
        cost_price: data.cost_price?.toString() || '',
        tax_rate: data.tax_rate?.toString() || '18',
        hsn_code: data.hsn_code || '',
        stock_quantity: data.stock_quantity?.toString() || '0',
        low_stock_threshold: data.low_stock_threshold?.toString() || '5',
        minimum_stock_level: (data as any).minimum_stock_level?.toString() || '5',
        reorder_quantity: (data as any).reorder_quantity?.toString() || '10',
        weight_kg: data.weight_kg?.toString() || '',
        dimensions_cm: data.dimensions_cm || '',
        warranty_months: data.warranty_months?.toString() || '',
        datasheet_url: data.datasheet_url || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        is_active: data.is_active ?? true,
        is_featured: data.is_featured ?? false,
        shopify_sync_enabled: data.shopify_sync_enabled ?? false,
        images: data.images || [],
        specifications: specs as Record<string, string>,
        tags: data.tags || [],
      });
    }
    setIsLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  // AI URL extraction handler
  const handleExtractFromUrl = async () => {
    if (!productUrl.trim()) {
      toast({ title: 'Error', description: 'Please enter a product URL', variant: 'destructive' });
      return;
    }

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-product-info', {
        body: { url: productUrl.trim() }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to extract product info');
      }

      const info = data.data;
      console.log('Extracted product info:', info);

      // Update form data with extracted info
      setFormData(prev => ({
        ...prev,
        name: info.name || prev.name,
        model_number: info.model_number || prev.model_number,
        short_description: info.short_description || prev.short_description,
        description: info.description || prev.description,
        dimensions_cm: info.dimensions_cm || prev.dimensions_cm,
        weight_kg: info.weight_kg?.toString() || prev.weight_kg,
        warranty_months: info.warranty_months?.toString() || prev.warranty_months,
        mrp: info.mrp?.toString() || prev.mrp,
        slug: info.name ? generateSlug(info.name) : prev.slug,
      }));

      // Try to match brand from extracted info
      if (info.brand) {
        const matchedBrand = brands.find(b => 
          b.name.toLowerCase() === info.brand?.toLowerCase() ||
          b.name.toLowerCase().includes(info.brand?.toLowerCase()) ||
          info.brand?.toLowerCase().includes(b.name.toLowerCase())
        );
        if (matchedBrand) {
          setFormData(prev => ({ ...prev, brand_id: matchedBrand.id }));
        }
      }

      // Update specifications for ALL product types (pre-populate for when type is selected)
      if (info.specifications) {
        const specs = info.specifications;
        
        // Auto-detect product type from specs if not already set
        let detectedType = productType;
        if (productType === 'general') {
          if (specs.wifi_band) {
            detectedType = 'wifi_camera';
          } else if (specs.channels && specs.poe_support === 'Yes') {
            detectedType = 'nvr';
          } else if (specs.channels) {
            detectedType = 'dvr';
          } else if (specs.resolution || specs.megapixel) {
            detectedType = 'cctv_camera';
          }
          
          if (detectedType !== 'general') {
            setProductType(detectedType);
            toast({
              title: 'Product Type Detected',
              description: `Detected as: ${PRODUCT_TYPES.find(t => t.value === detectedType)?.label || detectedType}`,
            });
          }
        }
        
        // Always update WiFi Camera specs
        setWifiCameraSpecs(prev => ({
          ...prev,
          resolution: specs.resolution || prev.resolution,
          megapixel: specs.megapixel || prev.megapixel,
          night_vision: specs.night_vision === 'Yes' ? true : prev.night_vision,
          night_vision_type: specs.night_vision_type || prev.night_vision_type,
          ir_range: specs.ir_range || prev.ir_range,
          wifi_band: specs.wifi_band || prev.wifi_band,
          power_type: specs.power_type || prev.power_type,
          two_way_audio: specs.two_way_audio === 'Yes' ? true : prev.two_way_audio,
          motion_detection: specs.motion_detection === 'Yes' ? true : prev.motion_detection,
          weatherproof_rating: specs.weatherproof_rating || prev.weatherproof_rating,
          lens_type: specs.lens_type || prev.lens_type,
          field_of_view: specs.field_of_view || prev.field_of_view,
          pan_support: specs.pan_support === 'Yes' ? true : prev.pan_support,
          tilt_support: specs.tilt_support === 'Yes' ? true : prev.tilt_support,
        }));
        
        // Helper functions to normalize AI values to dropdown values
        const normalizeSystemType = (val: string | undefined): string => {
          if (!val) return '';
          const v = val.toLowerCase();
          if (v.includes('ip') || v.includes('network')) return 'ip';
          if (v.includes('analog')) return 'analog';
          if (v.includes('wifi') || v.includes('wi-fi')) return 'wifi';
          return v;
        };
        
        const normalizeCameraType = (val: string | undefined): string => {
          if (!val) return '';
          const v = val.toLowerCase();
          if (v.includes('dome')) return 'dome';
          if (v.includes('bullet')) return 'bullet';
          if (v.includes('ptz')) return 'ptz';
          return v;
        };
        
        const normalizeIndoorOutdoor = (val: string | undefined): string => {
          if (!val) return '';
          const v = val.toLowerCase();
          if (v === 'indoor') return 'indoor';
          if (v === 'outdoor') return 'outdoor';
          if (v === 'both' || v.includes('indoor') && v.includes('outdoor')) return 'both';
          return v;
        };
        
        const normalizeMegapixel = (val: string | undefined): string => {
          if (!val) return '';
          const v = val.replace(/\s/g, '').toUpperCase();
          if (v.includes('2')) return '2MP';
          if (v.includes('4')) return '4MP';
          if (v.includes('5')) return '5MP';
          if (v.includes('8')) return '8MP';
          return v;
        };
        
        const normalizeLensSize = (val: string | undefined): string => {
          if (!val) return '';
          if (val.includes('2.8')) return '2.8mm';
          if (val.includes('3.6')) return '3.6mm';
          if (val.includes('6')) return '6mm';
          return 'other';
        };
        
        const normalizeFrameRate = (val: string | undefined): string => {
          if (!val) return '';
          if (val.includes('15')) return '15fps';
          if (val.includes('20')) return '20fps';
          if (val.includes('25')) return '25fps';
          if (val.includes('30')) return '30fps';
          return val.replace(/\s/g, '').toLowerCase();
        };
        
        const normalizeIRRange = (val: string | undefined): string => {
          if (!val) return '';
          if (val.includes('20')) return '20m';
          if (val.includes('30')) return '30m';
          if (val.includes('40')) return '40m';
          if (val.includes('50') || parseInt(val) >= 50) return '50m+';
          return val;
        };
        
        const normalizeAudioType = (val: string | undefined): string => {
          if (!val) return '';
          const v = val.toLowerCase();
          if (v.includes('speaker') || v.includes('mic & speaker')) return 'mic_speaker';
          if (v.includes('mic') || v.includes('built-in')) return 'built_in_mic';
          if (v.includes('external')) return 'external';
          return v;
        };
        
        const normalizePowerType = (val: string | undefined): string => {
          if (!val) return '';
          const v = val.toLowerCase();
          if (v.includes('poe')) return 'poe';
          if (v.includes('12v') || v.includes('dc') || v.includes('adapter')) return '12v_adapter';
          if (v.includes('battery')) return 'battery';
          return v;
        };
        
        const normalizeConnectorType = (val: string | undefined): string => {
          if (!val) return '';
          const v = val.toLowerCase();
          if (v.includes('bnc')) return 'bnc';
          if (v.includes('rj45') || v.includes('rj-45') || v.includes('ethernet')) return 'rj45';
          if (v.includes('wifi')) return 'wifi_only';
          return v;
        };
        
        const normalizeSDCard = (val: string | undefined): string => {
          if (!val) return '';
          if (val.includes('256')) return '256gb';
          if (val.includes('128')) return '128gb';
          return val;
        };
        
        const normalizeWarranty = (val: string | undefined): string => {
          if (!val) return '';
          const v = val.toLowerCase();
          if (v.includes('6 month')) return '6_months';
          if (v.includes('1 year') || v.includes('1year')) return '1_year';
          if (v.includes('2 year') || v.includes('2year')) return '2_years';
          if (v.includes('3 year') || v.includes('3year')) return '3_years';
          if (v.includes('5 year') || v.includes('5year')) return '5_years';
          return v;
        };
        
        const normalizeCompatibleWith = (val: string[] | undefined): string[] => {
          if (!val || !val.length) return ['DVR', 'NVR']; // Default for IP cameras
          const result: string[] = [];
          val.forEach(v => {
            const lower = v.toLowerCase();
            if (lower.includes('dvr')) result.push('DVR');
            if (lower.includes('nvr')) result.push('NVR');
          });
          // If it's an IP camera, it should be compatible with NVR
          return result.length ? result : ['DVR', 'NVR'];
        };
        
        // Always update CCTV Camera specs with comprehensive mapping
        setCctvSpecs(prev => ({
          ...prev,
          // System Classification
          cctv_system_type: normalizeSystemType(specs.cctv_system_type) || prev.cctv_system_type,
          camera_type: normalizeCameraType(specs.camera_type) || prev.camera_type,
          indoor_outdoor: normalizeIndoorOutdoor(specs.indoor_outdoor) || prev.indoor_outdoor,
          // Video & Image
          resolution: specs.resolution || prev.resolution,
          megapixel: normalizeMegapixel(specs.megapixel) || prev.megapixel,
          lens_type: specs.lens_type?.toLowerCase() || prev.lens_type,
          lens_size: normalizeLensSize(specs.lens_size) || prev.lens_size,
          frame_rate: normalizeFrameRate(specs.frame_rate) || prev.frame_rate,
          // Night Vision & IR
          ir_support: specs.ir_support === 'Yes' || specs.ir_range ? true : prev.ir_support,
          ir_range: normalizeIRRange(specs.ir_range) || prev.ir_range,
          night_vision: specs.night_vision === 'Yes' || specs.ir_range ? true : prev.night_vision,
          bw_night_vision: specs.bw_night_vision === 'Yes' || (specs.night_vision_type?.toLowerCase().includes('ir')) ? true : prev.bw_night_vision,
          color_night_vision: specs.color_night_vision === 'Yes' || (specs.night_vision_type?.toLowerCase().includes('color')) ? true : prev.color_night_vision,
          // Audio & Smart Features
          audio_support: specs.audio_support === 'Yes' || specs.audio_type ? true : prev.audio_support,
          audio_type: normalizeAudioType(specs.audio_type) || prev.audio_type,
          motion_detection: specs.motion_detection === 'Yes' ? true : prev.motion_detection,
          human_detection: specs.human_detection === 'Yes' ? true : prev.human_detection,
          ai_features: specs.ai_features?.length ? specs.ai_features : prev.ai_features,
          // Hardware & Body
          body_material: specs.body_material?.toLowerCase() || prev.body_material,
          color: specs.color?.toLowerCase() || prev.color,
          weatherproof_rating: specs.weatherproof_rating?.toUpperCase() || prev.weatherproof_rating,
          // Connectivity & Power
          power_type: normalizePowerType(specs.power_type) || prev.power_type,
          connector_type: normalizeConnectorType(specs.connector_type) || prev.connector_type,
          onboard_storage: specs.onboard_storage === 'Yes' || specs.sd_card_support ? true : prev.onboard_storage,
          sd_card_support: normalizeSDCard(specs.sd_card_support) || prev.sd_card_support,
          // Compatibility
          compatible_with: normalizeCompatibleWith(specs.compatible_with),
          supported_dvr_nvr_resolution: normalizeMegapixel(specs.megapixel) || prev.supported_dvr_nvr_resolution,
          // Warranty
          warranty_period: normalizeWarranty(specs.warranty_period) || prev.warranty_period,
        }));
        
        // Always update DVR specs
        setDvrSpecs((prev: Record<string, any>) => ({
          ...prev,
          channel_capacity: specs.channels?.toString() || prev.channel_capacity,
          max_hdd_capacity: specs.hdd_capacity || prev.max_hdd_capacity,
        }));
        
        // Always update NVR specs
        setNvrSpecs((prev: Record<string, any>) => ({
          ...prev,
          channel_capacity: specs.channels?.toString() || prev.channel_capacity,
          max_hdd_capacity: specs.hdd_capacity || prev.max_hdd_capacity,
          poe_ports: specs.poe_support === 'Yes' ? (prev.poe_ports || '8') : prev.poe_ports,
        }));
      }

      toast({ 
        title: 'Success', 
        description: `Product information extracted: ${info.name || 'Details found'}` 
      });

    } catch (error) {
      console.error('Extraction error:', error);
      toast({ 
        title: 'Extraction Failed', 
        description: error instanceof Error ? error.message : 'Could not extract product info from the URL',
        variant: 'destructive' 
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    
    // Validate CCTV-specific fields if product type is cctv_camera
    if (productType === 'cctv_camera') {
      const cctvValidation = validateCCTVSpecs(cctvSpecs);
      if (!cctvValidation.valid) {
        setValidationErrors(cctvValidation.errors);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required CCTV camera fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate DVR-specific fields if product type is dvr
    if (productType === 'dvr') {
      const dvrValidation = validateDVRSpecs(dvrSpecs);
      if (dvrValidation.length > 0) {
        setValidationErrors(dvrValidation);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required DVR fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate NVR-specific fields if product type is nvr
    if (productType === 'nvr') {
      const nvrValidation = validateNVRSpecs(nvrSpecs);
      if (nvrValidation.length > 0) {
        setValidationErrors(nvrValidation);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required NVR fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate HDD-specific fields if product type is hdd
    if (productType === 'hdd') {
      const hddValidation = validateHDDSpecs(hddSpecs);
      if (hddValidation.length > 0) {
        setValidationErrors(hddValidation);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required Hard Drive fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate UPS-specific fields if product type is ups
    if (productType === 'ups') {
      const upsValidation = validateUPSSpecs(upsSpecs);
      if (upsValidation.length > 0) {
        setValidationErrors(upsValidation);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required UPS fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate Cable-specific fields if product type is cables
    if (productType === 'cables') {
      const cableValidation = validateCableSpecs(cableSpecs);
      if (cableValidation.length > 0) {
        setValidationErrors(cableValidation);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required Cable fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate Rack-specific fields if product type is rack
    if (productType === 'rack') {
      const rackValidation = validateRackSpecs(rackSpecs);
      if (rackValidation.length > 0) {
        setValidationErrors(rackValidation);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required Rack fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate PoE Switch-specific fields
    if (productType === 'poe_switch') {
      const poeSwitchValidation = validatePoESwitchSpecs(poeSwitchSpecs);
      if (poeSwitchValidation.length > 0) {
        setValidationErrors(poeSwitchValidation);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required PoE Switch fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate BNC Connector-specific fields
    if (productType === 'bnc_connector') {
      const bncValidation = validateBNCConnectorSpecs(bncConnectorSpecs);
      if (bncValidation.length > 0) {
        setValidationErrors(bncValidation);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required BNC Connector fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate RJ45 Connector-specific fields
    if (productType === 'rj45_connector') {
      const rj45Validation = validateRJ45ConnectorSpecs(rj45ConnectorSpecs);
      if (rj45Validation) {
        setValidationErrors([rj45Validation]);
        toast({
          title: 'Validation Error',
          description: rj45Validation,
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate DC Pin-specific fields
    if (productType === 'dc_pin') {
      const dcPinValidation = validateDCPinSpecs(dcPinSpecs);
      if (dcPinValidation) {
        setValidationErrors([dcPinValidation]);
        toast({
          title: 'Validation Error',
          description: dcPinValidation,
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate Video Balun-specific fields
    if (productType === 'video_balun') {
      const validation = validateVideoBalunSpecs(videoBalunSpecs);
      if (validation) {
        setValidationErrors([validation]);
        toast({ title: 'Validation Error', description: validation, variant: 'destructive' });
        return;
      }
    }
    
    // Validate HDMI Cable-specific fields
    if (productType === 'hdmi_cable') {
      const validation = validateHDMICableSpecs(hdmiCableSpecs);
      if (validation) {
        setValidationErrors([validation]);
        toast({ title: 'Validation Error', description: validation, variant: 'destructive' });
        return;
      }
    }
    
    // Validate HDMI Splitter-specific fields
    if (productType === 'hdmi_splitter') {
      const validation = validateHDMISplitterSpecs(hdmiSplitterSpecs);
      if (validation) {
        setValidationErrors([validation]);
        toast({ title: 'Validation Error', description: validation, variant: 'destructive' });
        return;
      }
    }
    
    // Validate LAN to HDMI Converter-specific fields
    if (productType === 'lan_to_hdmi') {
      const validation = validateLANToHDMIConverterSpecs(lanToHdmiSpecs);
      if (validation) {
        setValidationErrors([validation]);
        toast({ title: 'Validation Error', description: validation, variant: 'destructive' });
        return;
      }
    }
    
    // Validate LAN to USB Converter-specific fields
    if (productType === 'lan_to_usb') {
      const validation = validateLANToUSBConverterSpecs(lanToUsbSpecs);
      if (validation) {
        setValidationErrors([validation]);
        toast({ title: 'Validation Error', description: validation, variant: 'destructive' });
        return;
      }
    }
    
    // Validate SMPS-specific fields
    if (productType === 'smps') {
      const validation = validateSMPSSpecs(smpsSpecs);
      if (validation) {
        setValidationErrors([validation]);
        toast({ title: 'Validation Error', description: validation, variant: 'destructive' });
        return;
      }
    }
    
    // Validate WiFi Camera-specific fields
    if (productType === 'wifi_camera') {
      const wifiValidation = validateWiFiCameraSpecs(wifiCameraSpecs);
      if (wifiValidation.length > 0) {
        setValidationErrors(wifiValidation);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required WiFi Camera fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Validate common required fields
    if (productType === 'cctv_camera' || productType === 'wifi_camera' || productType === 'dvr' || productType === 'nvr' || productType === 'hdd' || productType === 'ups' || productType === 'cables' || productType === 'rack' || productType === 'poe_switch' || productType === 'bnc_connector' || productType === 'rj45_connector' || productType === 'dc_pin' || productType === 'video_balun' || productType === 'hdmi_cable' || productType === 'hdmi_splitter' || productType === 'lan_to_hdmi' || productType === 'lan_to_usb' || productType === 'smps') {
      const commonErrors: string[] = [];
      if (!formData.brand_id) commonErrors.push('Brand is required');
      if (!formData.vendor_id) commonErrors.push('Vendor is required');
      if (!formData.purchase_price) commonErrors.push('Purchase Price is required');
      if (!formData.selling_price) commonErrors.push('Selling Price is required');
      
      if (commonErrors.length > 0) {
        setValidationErrors((prev) => [...prev, ...commonErrors]);
        toast({
          title: 'Validation Error',
          description: 'Please fill all required fields',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setIsSaving(true);

    // Build specifications object
    let specifications: Record<string, unknown> = { ...formData.specifications, product_type: productType };
    
    if (productType === 'cctv_camera') {
      specifications = {
        ...specifications,
        ...cctvSpecs,
        product_type: 'cctv_camera',
      };
    } else if (productType === 'dvr') {
      specifications = {
        ...specifications,
        ...dvrSpecs,
        product_type: 'dvr',
      };
    } else if (productType === 'nvr') {
      specifications = {
        ...specifications,
        ...nvrSpecs,
        product_type: 'nvr',
      };
    } else if (productType === 'hdd') {
      specifications = {
        ...specifications,
        ...hddSpecs,
        product_type: 'hdd',
      };
    } else if (productType === 'ups') {
      specifications = {
        ...specifications,
        ...upsSpecs,
        product_type: 'ups',
      };
    } else if (productType === 'cables') {
      specifications = {
        ...specifications,
        ...cableSpecs,
        product_type: 'cables',
      };
    } else if (productType === 'rack') {
      specifications = {
        ...specifications,
        ...rackSpecs,
        product_type: 'rack',
      };
    } else if (productType === 'poe_switch') {
      specifications = {
        ...specifications,
        ...poeSwitchSpecs,
        product_type: 'poe_switch',
      };
    } else if (productType === 'bnc_connector') {
      specifications = {
        ...specifications,
        ...bncConnectorSpecs,
        product_type: 'bnc_connector',
      };
    } else if (productType === 'rj45_connector') {
      specifications = {
        ...specifications,
        ...rj45ConnectorSpecs,
        product_type: 'rj45_connector',
      };
    } else if (productType === 'dc_pin') {
      specifications = {
        ...specifications,
        ...dcPinSpecs,
        product_type: 'dc_pin',
      };
    } else if (productType === 'video_balun') {
      specifications = {
        ...specifications,
        ...videoBalunSpecs,
        product_type: 'video_balun',
      };
    } else if (productType === 'hdmi_cable') {
      specifications = {
        ...specifications,
        ...hdmiCableSpecs,
        product_type: 'hdmi_cable',
      };
    } else if (productType === 'hdmi_splitter') {
      specifications = {
        ...specifications,
        ...hdmiSplitterSpecs,
        product_type: 'hdmi_splitter',
      };
    } else if (productType === 'lan_to_hdmi') {
      specifications = {
        ...specifications,
        ...lanToHdmiSpecs,
        product_type: 'lan_to_hdmi',
      };
    } else if (productType === 'lan_to_usb') {
      specifications = {
        ...specifications,
        ...lanToUsbSpecs,
        product_type: 'lan_to_usb',
      };
    } else if (productType === 'smps') {
      specifications = {
        ...specifications,
        ...smpsSpecs,
        product_type: 'smps',
      };
    } else if (productType === 'wifi_camera') {
      specifications = {
        ...specifications,
        ...wifiCameraSpecs,
        product_type: 'wifi_camera',
      };
    }

    const productData = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      sku: formData.sku || null,
      model_number: formData.model_number || null,
      barcode: formData.barcode || null,
      short_description: formData.short_description || null,
      description: formData.description || null,
      category_id: formData.category_id || null,
      brand_id: formData.brand_id || null,
      vendor_id: formData.vendor_id || null,
      mrp: formData.mrp ? parseFloat(formData.mrp) : null,
      selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
      tax_rate: parseFloat(formData.tax_rate) || 18,
      hsn_code: formData.hsn_code || null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
      minimum_stock_level: parseInt(formData.minimum_stock_level) || 5,
      reorder_quantity: parseInt(formData.reorder_quantity) || 10,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      dimensions_cm: formData.dimensions_cm || null,
      warranty_months: formData.warranty_months ? parseInt(formData.warranty_months) : null,
      datasheet_url: formData.datasheet_url || null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      shopify_sync_enabled: formData.shopify_sync_enabled,
      images: formData.images,
      specifications: specifications as Json,
      tags: formData.tags,
    };

    let error;

    if (isEdit && id) {
      const result = await supabase
        .from('shop_products')
        .update(productData)
        .eq('id', id);
      error = result.error;
    } else {
      const result = await supabase
        .from('shop_products')
        .insert(productData);
      error = result.error;
    }

    if (error) {
      toast({ title: 'Error saving product', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Product ${isEdit ? 'updated' : 'created'} successfully` });
      navigate('/shop/admin/products');
    }

    setIsSaving(false);
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/shop/admin/products')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update product details' : 'Create a new product'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {/* AI Product Extraction */}
          {!isEdit && (
            <Card className="border-2 border-dashed border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  AI Auto-Fill from Product URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Paste a product page URL and let AI automatically extract product name, model number, dimensions, specifications, and more.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="https://example.com/product-page"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      className="pl-10"
                      disabled={isExtracting}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleExtractFromUrl}
                    disabled={isExtracting || !productUrl.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Extract Info
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Product Type Selector - Always visible at top */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Product Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <Label htmlFor="product_type" className="text-sm font-medium">
                  Select Product Type *
                </Label>
                <Select
                  value={productType}
                  onValueChange={(v) => {
                    setProductType(v);
                    if (v === 'cctv_camera') {
                      setCctvSpecs(defaultCCTVSpecs);
                    } else if (v === 'dvr') {
                      setDvrSpecs({ cctv_system_type: 'analog', allow_in_quotation: true });
                    } else if (v === 'nvr') {
                      setNvrSpecs({ cctv_system_type: 'ip', allow_in_quotation: true });
                    } else if (v === 'hdd') {
                      setHddSpecs({ allow_in_quotation: true });
                    } else if (v === 'ups') {
                      setUpsSpecs({ allow_in_quotation: true });
                    } else if (v === 'cables') {
                      setCableSpecs({ allow_in_quotation: true });
                    } else if (v === 'rack') {
                      setRackSpecs({ allow_in_quotation: true });
                    } else if (v === 'poe_switch') {
                      setPoeSwitchSpecs({ allow_in_quotation: true });
                    } else if (v === 'bnc_connector') {
                      setBncConnectorSpecs({ allow_in_quotation: true });
                    } else if (v === 'wifi_camera') {
                      setWifiCameraSpecs(defaultWiFiCameraSpecs);
                    }
                  }}
                  disabled={isEdit && (productType === 'cctv_camera' || productType === 'wifi_camera' || productType === 'dvr' || productType === 'nvr' || productType === 'hdd' || productType === 'ups' || productType === 'cables' || productType === 'rack' || productType === 'poe_switch' || productType === 'bnc_connector')}
                >
                  <SelectTrigger className="bg-background mt-1">
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isEdit && (productType === 'cctv_camera' || productType === 'dvr' || productType === 'nvr' || productType === 'hdd' || productType === 'ups' || productType === 'cables' || productType === 'rack' || productType === 'poe_switch' || productType === 'bnc_connector') && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Product type cannot be changed after creation
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="model_number">Model Number</Label>
                      <Input
                        id="model_number"
                        value={formData.model_number}
                        onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                        placeholder="e.g., DS-2CD2143G2-I"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="mrp">MRP (₹)</Label>
                    <Input
                      id="mrp"
                      type="number"
                      step="0.01"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="selling_price">Selling Price (₹)</Label>
                    <Input
                      id="selling_price"
                      type="number"
                      step="0.01"
                      value={formData.selling_price}
                      onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchase_price">Purchase Price (₹)</Label>
                    <Input
                      id="purchase_price"
                      type="number"
                      step="0.01"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_price">Cost Price (₹)</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      step="0.01"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hsn_code">HSN Code</Label>
                    <Input
                      id="hsn_code"
                      value={formData.hsn_code}
                      onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      value={formData.low_stock_threshold}
                      onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimum_stock_level">Minimum Stock Level</Label>
                    <Input
                      id="minimum_stock_level"
                      type="number"
                      value={formData.minimum_stock_level}
                      onChange={(e) => setFormData({ ...formData, minimum_stock_level: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
                    <Input
                      id="reorder_quantity"
                      type="number"
                      value={formData.reorder_quantity}
                      onChange={(e) => setFormData({ ...formData, reorder_quantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="warranty_months">Warranty (Months)</Label>
                    <Input
                      id="warranty_months"
                      type="number"
                      value={formData.warranty_months}
                      onChange={(e) => setFormData({ ...formData, warranty_months: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt="" className="h-20 w-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={addImageUrl}>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Image URL
                  </Button>
                </CardContent>
              </Card>
              
              {/* CCTV Camera Specific Fields */}
              {productType === 'cctv_camera' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">CCTV Camera Specifications</h2>
                    <CCTVCameraFields specs={cctvSpecs} onChange={setCctvSpecs} />
                  </div>
                </div>
              )}
              
              {/* DVR Specific Fields */}
              {productType === 'dvr' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">DVR Specifications</h2>
                    <DVRFields 
                      specs={dvrSpecs} 
                      onSpecChange={(key, value) => setDvrSpecs(prev => ({ ...prev, [key]: value }))} 
                    />
                  </div>
                </div>
              )}
              
              {/* WiFi Camera Specific Fields */}
              {productType === 'wifi_camera' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-blue-600 mb-4">WiFi Camera Specifications</h2>
                    <WiFiCameraFields 
                      specs={wifiCameraSpecs} 
                      onChange={setWifiCameraSpecs}
                      vendors={vendors}
                      formData={{
                        vendor_id: formData.vendor_id,
                        purchase_price: formData.purchase_price,
                        selling_price: formData.selling_price,
                        stock_quantity: formData.stock_quantity,
                        low_stock_threshold: formData.low_stock_threshold,
                        tax_rate: formData.tax_rate,
                      }}
                      onFormDataChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* NVR Specific Fields */}
              {productType === 'nvr' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">NVR Specifications</h2>
                    <NVRFields 
                      specs={nvrSpecs} 
                      onSpecChange={(key, value) => setNvrSpecs(prev => ({ ...prev, [key]: value }))} 
                    />
                  </div>
                </div>
              )}
              
              {/* HDD Specific Fields */}
              {productType === 'hdd' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">Hard Drive Specifications</h2>
                    <HDDFields 
                      specs={hddSpecs} 
                      onSpecChange={(key, value) => setHddSpecs(prev => ({ ...prev, [key]: value }))} 
                    />
                  </div>
                </div>
              )}
              
              {/* UPS Specific Fields */}
              {productType === 'ups' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">UPS Specifications</h2>
                    <UPSFields 
                      specs={upsSpecs} 
                      onSpecChange={(key, value) => setUpsSpecs(prev => ({ ...prev, [key]: value }))} 
                    />
                  </div>
                </div>
              )}
              
              {/* Cable Specific Fields */}
              {productType === 'cables' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">Cable Specifications</h2>
                    <CableFields 
                      specs={cableSpecs} 
                      onChange={setCableSpecs}
                      vendors={vendors}
                      formData={{
                        vendor_id: formData.vendor_id,
                        purchase_price: formData.purchase_price,
                        selling_price: formData.selling_price,
                        stock_quantity: formData.stock_quantity,
                        low_stock_threshold: formData.low_stock_threshold,
                        tax_rate: formData.tax_rate,
                      }}
                      onFormDataChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* Rack Specific Fields */}
              {productType === 'rack' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">Rack Specifications</h2>
                    <RackFields 
                      specs={rackSpecs} 
                      onChange={setRackSpecs}
                      vendors={vendors}
                      formData={{
                        vendor_id: formData.vendor_id,
                        purchase_price: formData.purchase_price,
                        selling_price: formData.selling_price,
                        stock_quantity: formData.stock_quantity,
                        low_stock_threshold: formData.low_stock_threshold,
                        tax_rate: formData.tax_rate,
                      }}
                      onFormDataChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* PoE Switch Specific Fields */}
              {productType === 'poe_switch' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">PoE Switch Specifications</h2>
                    <PoESwitchFields 
                      specs={poeSwitchSpecs} 
                      onChange={setPoeSwitchSpecs}
                      vendors={vendors}
                      formData={{
                        vendor_id: formData.vendor_id,
                        purchase_price: formData.purchase_price,
                        selling_price: formData.selling_price,
                        stock_quantity: formData.stock_quantity,
                        low_stock_threshold: formData.low_stock_threshold,
                        tax_rate: formData.tax_rate,
                      }}
                      onFormDataChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* BNC Connector Specific Fields */}
              {productType === 'bnc_connector' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">BNC Connector Specifications</h2>
                    <BNCConnectorFields 
                      specs={bncConnectorSpecs} 
                      onChange={setBncConnectorSpecs}
                      vendors={vendors}
                      formData={{
                        vendor_id: formData.vendor_id,
                        purchase_price: formData.purchase_price,
                        selling_price: formData.selling_price,
                        stock_quantity: formData.stock_quantity,
                        low_stock_threshold: formData.low_stock_threshold,
                        tax_rate: formData.tax_rate,
                      }}
                      onFormDataChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* RJ45 Connector Specific Fields */}
              {productType === 'rj45_connector' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">RJ45 Connector Specifications</h2>
                    <RJ45ConnectorFields 
                      specifications={rj45ConnectorSpecs} 
                      onSpecificationChange={(key, value) => setRj45ConnectorSpecs(prev => ({ ...prev, [key]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* DC Pin Specific Fields */}
              {productType === 'dc_pin' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">DC Pin Specifications</h2>
                    <DCPinFields 
                      specifications={dcPinSpecs} 
                      onSpecificationChange={(key, value) => setDcPinSpecs(prev => ({ ...prev, [key]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* Video Balun Specific Fields */}
              {productType === 'video_balun' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">Video Balun Specifications</h2>
                    <VideoBalunFields 
                      specifications={videoBalunSpecs} 
                      onSpecificationChange={(key, value) => setVideoBalunSpecs(prev => ({ ...prev, [key]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* HDMI Cable Specific Fields */}
              {productType === 'hdmi_cable' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">HDMI Cable Specifications</h2>
                    <HDMICableFields 
                      specifications={hdmiCableSpecs} 
                      onSpecificationChange={(key, value) => setHdmiCableSpecs(prev => ({ ...prev, [key]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* HDMI Splitter Specific Fields */}
              {productType === 'hdmi_splitter' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">HDMI Splitter Specifications</h2>
                    <HDMISplitterFields 
                      specifications={hdmiSplitterSpecs} 
                      onSpecificationChange={(key, value) => setHdmiSplitterSpecs(prev => ({ ...prev, [key]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* LAN to HDMI Converter Specific Fields */}
              {productType === 'lan_to_hdmi' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">LAN to HDMI Converter Specifications</h2>
                    <LANToHDMIConverterFields 
                      specifications={lanToHdmiSpecs} 
                      onSpecificationChange={(key, value) => setLanToHdmiSpecs(prev => ({ ...prev, [key]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* LAN to USB Converter Specific Fields */}
              {productType === 'lan_to_usb' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">LAN to USB Converter Specifications</h2>
                    <LANToUSBConverterFields 
                      specifications={lanToUsbSpecs} 
                      onSpecificationChange={(key, value) => setLanToUsbSpecs(prev => ({ ...prev, [key]: value }))}
                    />
                  </div>
                </div>
              )}
              
              {/* SMPS Specific Fields */}
              {productType === 'smps' && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">SMPS (Power Supply) Specifications</h2>
                    <SMPSFields 
                      specifications={smpsSpecs} 
                      onSpecificationChange={(key, value) => setSmpsSpecs(prev => ({ ...prev, [key]: value }))}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Active</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_featured">Featured</Label>
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shopify_sync">Shopify Sync</Label>
                    <Switch
                      id="shopify_sync"
                      checked={formData.shopify_sync_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, shopify_sync_enabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Brand</Label>
                    <Select
                      value={formData.brand_id}
                      onValueChange={(value) => setFormData({ ...formData, brand_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Vendor</Label>
                    <Select
                      value={formData.vendor_id}
                      onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Physical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input
                      id="weight_kg"
                      type="number"
                      step="0.01"
                      value={formData.weight_kg}
                      onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensions_cm">Dimensions (L×W×H cm)</Label>
                    <Input
                      id="dimensions_cm"
                      placeholder="30×20×10"
                      value={formData.dimensions_cm}
                      onChange={(e) => setFormData({ ...formData, dimensions_cm: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full bg-shop-orange hover:bg-shop-orange-dark" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </div>
      </form>
    </div>
  );
}