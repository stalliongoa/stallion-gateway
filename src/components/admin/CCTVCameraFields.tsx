import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export interface CCTVSpecs {
  // System Classification
  cctv_system_type: string;
  camera_type: string;
  indoor_outdoor: string;
  
  // Video & Image
  resolution: string;
  megapixel: string;
  lens_type: string;
  lens_size: string;
  frame_rate: string;
  
  // Night Vision & IR
  ir_support: boolean;
  ir_range: string;
  night_vision: boolean;
  bw_night_vision: boolean;
  color_night_vision: boolean;
  
  // Audio & Smart Features
  audio_support: boolean;
  audio_type: string;
  motion_detection: boolean;
  human_detection: boolean;
  ai_features: string[];
  
  // Hardware & Body
  body_material: string;
  color: string;
  weatherproof_rating: string;
  vertical_rotation: boolean;
  horizontal_rotation: boolean;
  
  // Connectivity & Power
  power_type: string;
  connector_type: string;
  onboard_storage: boolean;
  sd_card_support: string;
  
  // Compatibility
  compatible_with: string[];
  supported_dvr_nvr_resolution: string;
  
  // Warranty
  warranty_period: string;
  warranty_type: string;
  installation_manual_url: string;
  
  // Status & Visibility
  show_in_store: boolean;
  allow_in_quotation_builder: boolean;
}

export const defaultCCTVSpecs: CCTVSpecs = {
  cctv_system_type: '',
  camera_type: '',
  indoor_outdoor: '',
  resolution: '',
  megapixel: '',
  lens_type: '',
  lens_size: '',
  frame_rate: '',
  ir_support: false,
  ir_range: '',
  night_vision: false,
  bw_night_vision: false,
  color_night_vision: false,
  audio_support: false,
  audio_type: '',
  motion_detection: false,
  human_detection: false,
  ai_features: [],
  body_material: '',
  color: '',
  weatherproof_rating: '',
  vertical_rotation: false,
  horizontal_rotation: false,
  power_type: '',
  connector_type: '',
  onboard_storage: false,
  sd_card_support: '',
  compatible_with: [],
  supported_dvr_nvr_resolution: '',
  warranty_period: '',
  warranty_type: '',
  installation_manual_url: '',
  show_in_store: true,
  allow_in_quotation_builder: true,
};

interface CCTVCameraFieldsProps {
  specs: CCTVSpecs;
  onChange: (specs: CCTVSpecs) => void;
}

const AI_FEATURES_OPTIONS = [
  'Face Detection',
  'Line Crossing',
  'Intrusion Detection',
];

export default function CCTVCameraFields({ specs, onChange }: CCTVCameraFieldsProps) {
  const updateSpec = <K extends keyof CCTVSpecs>(key: K, value: CCTVSpecs[K]) => {
    onChange({ ...specs, [key]: value });
  };

  const toggleArrayItem = (key: 'ai_features' | 'compatible_with', item: string) => {
    const currentArray = specs[key];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updateSpec(key, newArray);
  };

  return (
    <div className="space-y-6">
      {/* Section 2: CCTV System Classification */}
      <Card className="border-orange-200 bg-orange-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-orange-800">CCTV System Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">CCTV System Type *</Label>
            <Select value={specs.cctv_system_type} onValueChange={(v) => updateSpec('cctv_system_type', v)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analog">Analog</SelectItem>
                <SelectItem value="ip">IP</SelectItem>
                <SelectItem value="wifi">WiFi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Camera Type *</Label>
            <Select value={specs.camera_type} onValueChange={(v) => updateSpec('camera_type', v)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select camera type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dome">Dome</SelectItem>
                <SelectItem value="bullet">Bullet</SelectItem>
                <SelectItem value="ptz">PTZ</SelectItem>
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
                <SelectItem value="720p">720p</SelectItem>
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
                <SelectItem value="4MP">4 MP</SelectItem>
                <SelectItem value="5MP">5 MP</SelectItem>
                <SelectItem value="8MP">8 MP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Lens Type *</Label>
            <Select value={specs.lens_type} onValueChange={(v) => updateSpec('lens_type', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="varifocal">Varifocal</SelectItem>
                <SelectItem value="motorized">Motorized</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Lens Size</Label>
            <Select value={specs.lens_size} onValueChange={(v) => updateSpec('lens_size', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2.8mm">2.8mm</SelectItem>
                <SelectItem value="3.6mm">3.6mm</SelectItem>
                <SelectItem value="6mm">6mm</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
                <SelectItem value="30fps">30 fps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Night Vision & IR Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Night Vision & IR Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">IR Support *</Label>
              <Switch
                checked={specs.ir_support}
                onCheckedChange={(v) => updateSpec('ir_support', v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Night Vision *</Label>
              <Switch
                checked={specs.night_vision}
                onCheckedChange={(v) => updateSpec('night_vision', v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">B&W Night Vision</Label>
              <Switch
                checked={specs.bw_night_vision}
                onCheckedChange={(v) => updateSpec('bw_night_vision', v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Color Night Vision</Label>
              <Switch
                checked={specs.color_night_vision}
                onCheckedChange={(v) => updateSpec('color_night_vision', v)}
              />
            </div>
          </div>
          {specs.ir_support && (
            <div className="max-w-xs">
              <Label className="text-sm font-medium">IR Range</Label>
              <Select value={specs.ir_range} onValueChange={(v) => updateSpec('ir_range', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select IR range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20m">20m</SelectItem>
                  <SelectItem value="30m">30m</SelectItem>
                  <SelectItem value="40m">40m</SelectItem>
                  <SelectItem value="50m+">50m+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 5: Audio & Smart Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Audio & Smart Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Audio Support *</Label>
              <Switch
                checked={specs.audio_support}
                onCheckedChange={(v) => updateSpec('audio_support', v)}
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
          {specs.audio_support && (
            <div className="max-w-xs">
              <Label className="text-sm font-medium">Audio Type</Label>
              <Select value={specs.audio_type} onValueChange={(v) => updateSpec('audio_type', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audio type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="built_in_mic">Built-in Mic</SelectItem>
                  <SelectItem value="mic_speaker">Mic + Speaker</SelectItem>
                  <SelectItem value="external">External Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label className="text-sm font-medium mb-2 block">AI Features</Label>
            <div className="flex flex-wrap gap-4">
              {AI_FEATURES_OPTIONS.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ai-${feature}`}
                    checked={specs.ai_features.includes(feature)}
                    onCheckedChange={() => toggleArrayItem('ai_features', feature)}
                  />
                  <Label htmlFor={`ai-${feature}`} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Hardware & Body Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Hardware & Body Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              <Label className="text-sm font-medium">Color</Label>
              <Select value={specs.color} onValueChange={(v) => updateSpec('color', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="grey">Grey</SelectItem>
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
                  <SelectItem value="not_rated">Not Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Vertical Rotation *</Label>
              <Switch
                checked={specs.vertical_rotation}
                onCheckedChange={(v) => updateSpec('vertical_rotation', v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm font-medium">Horizontal Rotation</Label>
              <Switch
                checked={specs.horizontal_rotation}
                onCheckedChange={(v) => updateSpec('horizontal_rotation', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Connectivity & Power */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Connectivity & Power</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Power Type *</Label>
              <Select value={specs.power_type} onValueChange={(v) => updateSpec('power_type', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select power type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12v_adapter">12V Adapter</SelectItem>
                  <SelectItem value="poe">PoE</SelectItem>
                  <SelectItem value="battery">Battery Powered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Connector Type</Label>
              <Select value={specs.connector_type} onValueChange={(v) => updateSpec('connector_type', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select connector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bnc">BNC</SelectItem>
                  <SelectItem value="rj45">RJ45</SelectItem>
                  <SelectItem value="wifi_only">WiFi Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg h-[58px]">
              <Label className="text-sm font-medium">Onboard Storage</Label>
              <Switch
                checked={specs.onboard_storage}
                onCheckedChange={(v) => updateSpec('onboard_storage', v)}
              />
            </div>
          </div>
          {specs.onboard_storage && (
            <div className="max-w-xs">
              <Label className="text-sm font-medium">SD Card Support</Label>
              <Select value={specs.sd_card_support} onValueChange={(v) => updateSpec('sd_card_support', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128gb">Up to 128GB</SelectItem>
                  <SelectItem value="256gb">Up to 256GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 8: Compatibility */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Compatibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Compatible With *</Label>
            <div className="flex flex-wrap gap-4">
              {['DVR', 'NVR'].map((device) => (
                <div key={device} className="flex items-center space-x-2">
                  <Checkbox
                    id={`compat-${device}`}
                    checked={specs.compatible_with.includes(device)}
                    onCheckedChange={() => toggleArrayItem('compatible_with', device)}
                  />
                  <Label htmlFor={`compat-${device}`} className="text-sm cursor-pointer">
                    {device}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-xs">
            <Label className="text-sm font-medium">Supported DVR/NVR Resolution</Label>
            <Select
              value={specs.supported_dvr_nvr_resolution}
              onValueChange={(v) => updateSpec('supported_dvr_nvr_resolution', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2MP">2MP</SelectItem>
                <SelectItem value="4MP">4MP</SelectItem>
                <SelectItem value="5MP">5MP</SelectItem>
                <SelectItem value="8MP">8MP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 10: Warranty */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Warranty & Documentation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Warranty Period</Label>
            <Select value={specs.warranty_period} onValueChange={(v) => updateSpec('warranty_period', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6_months">6 Months</SelectItem>
                <SelectItem value="1_year">1 Year</SelectItem>
                <SelectItem value="2_years">2 Years</SelectItem>
                <SelectItem value="3_years">3 Years</SelectItem>
                <SelectItem value="5_years">5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Warranty Type</Label>
            <Select value={specs.warranty_type} onValueChange={(v) => updateSpec('warranty_type', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 12: Status & Visibility */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-800">Status & Visibility</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
            <Label className="text-sm font-medium">Show in Store</Label>
            <Switch
              checked={specs.show_in_store}
              onCheckedChange={(v) => updateSpec('show_in_store', v)}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
            <Label className="text-sm font-medium">Allow in Quotation Builder *</Label>
            <Switch
              checked={specs.allow_in_quotation_builder}
              onCheckedChange={(v) => updateSpec('allow_in_quotation_builder', v)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Validation function for CCTV Camera products
export function validateCCTVSpecs(specs: CCTVSpecs): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields
  if (!specs.cctv_system_type) errors.push('CCTV System Type is required');
  if (!specs.camera_type) errors.push('Camera Type is required');
  if (!specs.indoor_outdoor) errors.push('Indoor/Outdoor selection is required');
  if (!specs.resolution) errors.push('Resolution is required');
  if (!specs.megapixel) errors.push('Megapixel is required');
  if (!specs.lens_type) errors.push('Lens Type is required');
  if (!specs.body_material) errors.push('Body Material is required');
  if (!specs.power_type) errors.push('Power Type is required');
  if (specs.compatible_with.length === 0) errors.push('Compatible With (DVR/NVR) is required');
  
  // IR Support and Night Vision are toggles but marked as required info
  // (they default to false which is a valid state)
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
