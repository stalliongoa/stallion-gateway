import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export interface WiFiCameraSpecs {
  // WiFi Camera Type & Usage
  wifi_camera_type: string;
  indoor_outdoor: string;
  
  // Video & Image Specifications
  resolution: string;
  megapixel: string;
  lens_type: string;
  field_of_view: string;
  frame_rate: string;
  
  // Night Vision & Display
  night_vision: boolean;
  night_vision_type: string;
  ir_range: string;
  
  // Pan / Tilt / Zoom
  pan_support: boolean;
  tilt_support: boolean;
  zoom_support: string;
  pan_range: string;
  tilt_range: string;
  
  // Audio & Smart Features
  two_way_audio: boolean;
  built_in_mic_speaker: boolean;
  motion_detection: boolean;
  human_detection: boolean;
  ai_features: string[];
  
  // Connectivity & Network
  wifi_band: string;
  lan_port: boolean;
  mobile_app: string;
  cloud_storage: boolean;
  sd_card_support: string;
  
  // Power & Solar
  power_type: string;
  battery_capacity: string;
  solar_panel_included: boolean;
  
  // Hardware & Build
  body_material: string;
  weatherproof_rating: string;
  color: string;
  
  // Storage & Recording
  recording_modes: string[];
  
  // Warranty & Documentation
  warranty_period: string;
  datasheet_url: string;
  manual_url: string;
  
  // Media
  video_url: string;
  
  // Status & Visibility
  show_in_store: boolean;
  allow_in_quotation: boolean;
}

export const defaultWiFiCameraSpecs: WiFiCameraSpecs = {
  wifi_camera_type: '',
  indoor_outdoor: '',
  resolution: '',
  megapixel: '',
  lens_type: '',
  field_of_view: '',
  frame_rate: '',
  night_vision: false,
  night_vision_type: '',
  ir_range: '',
  pan_support: false,
  tilt_support: false,
  zoom_support: '',
  pan_range: '',
  tilt_range: '',
  two_way_audio: false,
  built_in_mic_speaker: false,
  motion_detection: false,
  human_detection: false,
  ai_features: [],
  wifi_band: '',
  lan_port: false,
  mobile_app: '',
  cloud_storage: false,
  sd_card_support: '',
  power_type: '',
  battery_capacity: '',
  solar_panel_included: false,
  body_material: '',
  weatherproof_rating: '',
  color: '',
  recording_modes: [],
  warranty_period: '',
  datasheet_url: '',
  manual_url: '',
  video_url: '',
  show_in_store: true,
  allow_in_quotation: true,
};

interface WiFiCameraFieldsProps {
  specs: WiFiCameraSpecs;
  onChange: (specs: WiFiCameraSpecs) => void;
  vendors: { id: string; name: string }[];
  formData: {
    vendor_id: string;
    purchase_price: string;
    selling_price: string;
    stock_quantity: string;
    low_stock_threshold: string;
    tax_rate: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

const AI_FEATURES_OPTIONS = [
  'Face Detection',
  'Package Detection',
  'Sound Detection',
];

const RECORDING_MODES_OPTIONS = [
  'Continuous',
  'Motion Based',
  'Scheduled',
];

export function validateWiFiCameraSpecs(specs: WiFiCameraSpecs): string[] {
  const errors: string[] = [];
  
  if (!specs.wifi_camera_type) errors.push('WiFi Camera Type is required');
  if (!specs.indoor_outdoor) errors.push('Indoor/Outdoor selection is required');
  if (!specs.resolution) errors.push('Resolution is required');
  if (!specs.megapixel) errors.push('Megapixel is required');
  if (!specs.wifi_band) errors.push('WiFi Band is required');
  if (!specs.power_type) errors.push('Power Type is required');
  if (!specs.body_material) errors.push('Body Material is required');
  
  return errors;
}

export default function WiFiCameraFields({ 
  specs, 
  onChange, 
  vendors, 
  formData, 
  onFormDataChange 
}: WiFiCameraFieldsProps) {
  const updateSpec = <K extends keyof WiFiCameraSpecs>(key: K, value: WiFiCameraSpecs[K]) => {
    onChange({ ...specs, [key]: value });
  };

  const toggleArrayItem = (key: 'ai_features' | 'recording_modes', item: string) => {
    const currentArray = specs[key];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updateSpec(key, newArray);
  };

  return (
    <div className="space-y-6">
      {/* Section 2: WiFi Camera Type & Usage */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-800">WiFi Camera Type & Usage</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">WiFi Camera Type *</Label>
            <Select value={specs.wifi_camera_type} onValueChange={(v) => updateSpec('wifi_camera_type', v)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="pt">PT (Pan-Tilt)</SelectItem>
                <SelectItem value="ptz">PTZ (Pan-Tilt-Zoom)</SelectItem>
                <SelectItem value="solar">Solar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Indoor / Outdoor *</Label>
            <Select value={specs.indoor_outdoor} onValueChange={(v) => updateSpec('indoor_outdoor', v)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Video & Image Specifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Video & Image Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <Label className="text-sm font-medium">Resolution *</Label>
            <Select value={specs.resolution} onValueChange={(v) => updateSpec('resolution', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="2K">2K</SelectItem>
                <SelectItem value="4K">4K</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Megapixel *</Label>
            <Select value={specs.megapixel} onValueChange={(v) => updateSpec('megapixel', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2MP">2 MP</SelectItem>
                <SelectItem value="3MP">3 MP</SelectItem>
                <SelectItem value="4MP">4 MP</SelectItem>
                <SelectItem value="5MP">5 MP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Lens Type</Label>
            <Select value={specs.lens_type} onValueChange={(v) => updateSpec('lens_type', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="wide_angle">Wide Angle</SelectItem>
                <SelectItem value="motorized">Motorized</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Field of View</Label>
            <Select value={specs.field_of_view} onValueChange={(v) => updateSpec('field_of_view', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90°</SelectItem>
                <SelectItem value="110">110°</SelectItem>
                <SelectItem value="130">130°</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Frame Rate</Label>
            <Select value={specs.frame_rate} onValueChange={(v) => updateSpec('frame_rate', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15fps">15 fps</SelectItem>
                <SelectItem value="20fps">20 fps</SelectItem>
                <SelectItem value="25fps">25 fps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Night Vision & Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Night Vision & Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg max-w-xs">
            <Label className="text-sm font-medium">Night Vision *</Label>
            <Switch
              checked={specs.night_vision}
              onCheckedChange={(v) => updateSpec('night_vision', v)}
            />
          </div>
          {specs.night_vision && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
              <div>
                <Label className="text-sm font-medium">Night Vision Type</Label>
                <Select value={specs.night_vision_type} onValueChange={(v) => updateSpec('night_vision_type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ir_bw">IR (Black & White)</SelectItem>
                    <SelectItem value="full_color">Full Color</SelectItem>
                    <SelectItem value="dual_light">Dual Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">IR Range</Label>
                <Select value={specs.ir_range} onValueChange={(v) => updateSpec('ir_range', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10m">10m</SelectItem>
                    <SelectItem value="20m">20m</SelectItem>
                    <SelectItem value="30m">30m</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 5: Pan / Tilt / Zoom */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Pan / Tilt / Zoom</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Pan Support *</Label>
              <Switch
                checked={specs.pan_support}
                onCheckedChange={(v) => updateSpec('pan_support', v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Tilt Support *</Label>
              <Switch
                checked={specs.tilt_support}
                onCheckedChange={(v) => updateSpec('tilt_support', v)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Zoom Support</Label>
              <Select value={specs.zoom_support} onValueChange={(v) => updateSpec('zoom_support', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="optical">Optical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            {specs.pan_support && (
              <div>
                <Label className="text-sm font-medium">Pan Range</Label>
                <Select value={specs.pan_range} onValueChange={(v) => updateSpec('pan_range', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="270">270°</SelectItem>
                    <SelectItem value="360">360°</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {specs.tilt_support && (
              <div>
                <Label className="text-sm font-medium">Tilt Range</Label>
                <Select value={specs.tilt_range} onValueChange={(v) => updateSpec('tilt_range', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90°</SelectItem>
                    <SelectItem value="120">120°</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Audio & Smart Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Audio & Smart Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Two-Way Audio *</Label>
              <Switch
                checked={specs.two_way_audio}
                onCheckedChange={(v) => updateSpec('two_way_audio', v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Built-in Mic & Speaker</Label>
              <Switch
                checked={specs.built_in_mic_speaker}
                onCheckedChange={(v) => updateSpec('built_in_mic_speaker', v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Motion Detection</Label>
              <Switch
                checked={specs.motion_detection}
                onCheckedChange={(v) => updateSpec('motion_detection', v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Human Detection</Label>
              <Switch
                checked={specs.human_detection}
                onCheckedChange={(v) => updateSpec('human_detection', v)}
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">AI Features</Label>
            <div className="flex flex-wrap gap-4">
              {AI_FEATURES_OPTIONS.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`wifi-ai-${feature}`}
                    checked={specs.ai_features.includes(feature)}
                    onCheckedChange={() => toggleArrayItem('ai_features', feature)}
                  />
                  <Label htmlFor={`wifi-ai-${feature}`} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Connectivity & Network */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Connectivity & Network</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">WiFi Band *</Label>
              <Select value={specs.wifi_band} onValueChange={(v) => updateSpec('wifi_band', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select band" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2.4ghz">2.4 GHz</SelectItem>
                  <SelectItem value="dual_band">Dual Band (2.4 + 5 GHz)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">LAN Port</Label>
              <Switch
                checked={specs.lan_port}
                onCheckedChange={(v) => updateSpec('lan_port', v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Cloud Storage</Label>
              <Switch
                checked={specs.cloud_storage}
                onCheckedChange={(v) => updateSpec('cloud_storage', v)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
            <div>
              <Label className="text-sm font-medium">Mobile App Support *</Label>
              <Input
                value={specs.mobile_app}
                onChange={(e) => updateSpec('mobile_app', e.target.value)}
                placeholder="e.g., Smart Life, iCSee"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">SD Card Support</Label>
              <Select value={specs.sd_card_support} onValueChange={(v) => updateSpec('sd_card_support', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="128gb">Up to 128 GB</SelectItem>
                  <SelectItem value="256gb">Up to 256 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Power & Solar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Power & Solar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Power Type *</Label>
              <Select value={specs.power_type} onValueChange={(v) => updateSpec('power_type', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select power type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adapter">Adapter</SelectItem>
                  <SelectItem value="battery">Battery</SelectItem>
                  <SelectItem value="solar">Solar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(specs.power_type === 'battery' || specs.power_type === 'solar') && (
              <div>
                <Label className="text-sm font-medium">Battery Capacity (mAh)</Label>
                <Input
                  value={specs.battery_capacity}
                  onChange={(e) => updateSpec('battery_capacity', e.target.value)}
                  placeholder="e.g., 5000"
                />
              </div>
            )}
            {specs.power_type === 'solar' && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label className="text-sm font-medium">Solar Panel Included</Label>
                <Switch
                  checked={specs.solar_panel_included}
                  onCheckedChange={(v) => updateSpec('solar_panel_included', v)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 9: Hardware & Build */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Hardware & Build</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Body Material *</Label>
            <Select value={specs.body_material} onValueChange={(v) => updateSpec('body_material', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plastic">Plastic</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Weatherproof Rating</Label>
            <Select value={specs.weatherproof_rating} onValueChange={(v) => updateSpec('weatherproof_rating', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IP65">IP65</SelectItem>
                <SelectItem value="IP66">IP66</SelectItem>
                <SelectItem value="IP67">IP67</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Color</Label>
            <Select value={specs.color} onValueChange={(v) => updateSpec('color', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">Black</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 10: Storage & Recording */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Storage & Recording</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-sm font-medium mb-2 block">Recording Modes</Label>
          <div className="flex flex-wrap gap-4">
            {RECORDING_MODES_OPTIONS.map((mode) => (
              <div key={mode} className="flex items-center space-x-2">
                <Checkbox
                  id={`recording-${mode}`}
                  checked={specs.recording_modes.includes(mode)}
                  onCheckedChange={() => toggleArrayItem('recording_modes', mode)}
                />
                <Label htmlFor={`recording-${mode}`} className="text-sm cursor-pointer">
                  {mode}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 11: Inventory & Pricing */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-800">Inventory & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Vendor / Supplier *</Label>
            <Select value={formData.vendor_id} onValueChange={(v) => onFormDataChange('vendor_id', v)}>
              <SelectTrigger className="bg-background">
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
          <div>
            <Label className="text-sm font-medium">Purchase Price (₹) *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.purchase_price}
              onChange={(e) => onFormDataChange('purchase_price', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Selling Price (₹) *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.selling_price}
              onChange={(e) => onFormDataChange('selling_price', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">GST %</Label>
            <Select value={formData.tax_rate} onValueChange={(v) => onFormDataChange('tax_rate', v)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select GST" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18">18%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Stock Quantity *</Label>
            <Input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => onFormDataChange('stock_quantity', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Minimum Stock Alert</Label>
            <Input
              type="number"
              value={formData.low_stock_threshold}
              onChange={(e) => onFormDataChange('low_stock_threshold', e.target.value)}
              placeholder="5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 12: Warranty & Documentation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Warranty & Documentation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Warranty Period</Label>
            <Select value={specs.warranty_period} onValueChange={(v) => updateSpec('warranty_period', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select warranty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_year">1 Year</SelectItem>
                <SelectItem value="2_years">2 Years</SelectItem>
                <SelectItem value="3_years">3 Years</SelectItem>
                <SelectItem value="5_years">5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Datasheet URL</Label>
            <Input
              value={specs.datasheet_url}
              onChange={(e) => updateSpec('datasheet_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label className="text-sm font-medium">User Manual URL</Label>
            <Input
              value={specs.manual_url}
              onChange={(e) => updateSpec('manual_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 13: Media */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label className="text-sm font-medium">Product Video URL</Label>
            <Input
              value={specs.video_url}
              onChange={(e) => updateSpec('video_url', e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 14: Status & Visibility */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-purple-800">Status & Visibility</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label className="text-sm font-medium">Show in Store</Label>
            <Switch
              checked={specs.show_in_store}
              onCheckedChange={(v) => updateSpec('show_in_store', v)}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label className="text-sm font-medium">Allow in Quotation Builder *</Label>
            <Switch
              checked={specs.allow_in_quotation}
              onCheckedChange={(v) => updateSpec('allow_in_quotation', v)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
