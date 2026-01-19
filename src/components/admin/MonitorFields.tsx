import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export interface MonitorSpecs {
  screen_size: string;
  resolution: string;
  panel_type: string;
  refresh_rate: string;
  response_time: string;
  aspect_ratio: string;
  brightness: string;
  contrast_ratio: string;
  viewing_angle: string;
  hdmi_ports: number;
  vga_ports: number;
  display_port: number;
  usb_ports: number;
  audio_output: boolean;
  built_in_speakers: boolean;
  vesa_mount: boolean;
  vesa_size: string;
  tilt_adjustable: boolean;
  height_adjustable: boolean;
  pivot_rotation: boolean;
  power_consumption: string;
  allow_in_quotation: boolean;
}

export const defaultMonitorSpecs: MonitorSpecs = {
  screen_size: '',
  resolution: '',
  panel_type: '',
  refresh_rate: '',
  response_time: '',
  aspect_ratio: '16:9',
  brightness: '',
  contrast_ratio: '',
  viewing_angle: '',
  hdmi_ports: 1,
  vga_ports: 0,
  display_port: 0,
  usb_ports: 0,
  audio_output: false,
  built_in_speakers: false,
  vesa_mount: true,
  vesa_size: '100x100',
  tilt_adjustable: true,
  height_adjustable: false,
  pivot_rotation: false,
  power_consumption: '',
  allow_in_quotation: true,
};

export const validateMonitorSpecs = (specs: MonitorSpecs): string | null => {
  if (!specs.screen_size) return "Screen size is required";
  if (!specs.resolution) return "Resolution is required";
  if (!specs.panel_type) return "Panel type is required";
  if (specs.hdmi_ports < 0 && specs.vga_ports < 0 && specs.display_port < 0) {
    return "At least one video input port is required";
  }
  return null;
};

interface MonitorFieldsProps {
  specifications: MonitorSpecs;
  onSpecificationChange: (key: keyof MonitorSpecs, value: any) => void;
}

const SCREEN_SIZES = ['18.5"', '19"', '21.5"', '22"', '23.8"', '24"', '27"', '32"', '34"', '43"', '49"', '55"'];
const RESOLUTIONS = ['1366x768 (HD)', '1920x1080 (Full HD)', '2560x1080 (UW Full HD)', '2560x1440 (QHD)', '3440x1440 (UW QHD)', '3840x2160 (4K UHD)'];
const PANEL_TYPES = ['IPS', 'VA', 'TN', 'OLED', 'Mini LED'];
const REFRESH_RATES = ['60Hz', '75Hz', '100Hz', '120Hz', '144Hz', '165Hz', '240Hz'];
const RESPONSE_TIMES = ['1ms', '2ms', '4ms', '5ms', '8ms', '14ms'];
const ASPECT_RATIOS = ['16:9', '21:9', '32:9', '4:3'];
const VESA_SIZES = ['75x75', '100x100', '200x200', '400x400'];

const MonitorFields = ({ specifications, onSpecificationChange }: MonitorFieldsProps) => {
  const handleQuickFill = () => {
    onSpecificationChange('screen_size', '21.5"');
    onSpecificationChange('resolution', '1920x1080 (Full HD)');
    onSpecificationChange('panel_type', 'IPS');
    onSpecificationChange('refresh_rate', '60Hz');
    onSpecificationChange('response_time', '5ms');
    onSpecificationChange('aspect_ratio', '16:9');
    onSpecificationChange('brightness', '250 cd/m²');
    onSpecificationChange('contrast_ratio', '1000:1');
    onSpecificationChange('viewing_angle', '178°/178°');
    onSpecificationChange('hdmi_ports', 1);
    onSpecificationChange('vga_ports', 1);
    onSpecificationChange('vesa_mount', true);
    onSpecificationChange('vesa_size', '100x100');
    onSpecificationChange('tilt_adjustable', true);
    onSpecificationChange('power_consumption', '25W');
  };

  return (
    <div className="space-y-6">
      {/* Quick Fill Button */}
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={handleQuickFill}>
          <Sparkles className="h-4 w-4 mr-2" />
          Quick Fill Defaults
        </Button>
      </div>

      {/* Display Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Display Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Screen Size <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.screen_size}
              onValueChange={(value) => onSpecificationChange("screen_size", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select screen size" />
              </SelectTrigger>
              <SelectContent>
                {SCREEN_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Resolution <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.resolution}
              onValueChange={(value) => onSpecificationChange("resolution", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTIONS.map((res) => (
                  <SelectItem key={res} value={res}>{res}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Panel Type <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.panel_type}
              onValueChange={(value) => onSpecificationChange("panel_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select panel type" />
              </SelectTrigger>
              <SelectContent>
                {PANEL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Refresh Rate</Label>
            <Select
              value={specifications.refresh_rate}
              onValueChange={(value) => onSpecificationChange("refresh_rate", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select refresh rate" />
              </SelectTrigger>
              <SelectContent>
                {REFRESH_RATES.map((rate) => (
                  <SelectItem key={rate} value={rate}>{rate}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Response Time</Label>
            <Select
              value={specifications.response_time}
              onValueChange={(value) => onSpecificationChange("response_time", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select response time" />
              </SelectTrigger>
              <SelectContent>
                {RESPONSE_TIMES.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select
              value={specifications.aspect_ratio}
              onValueChange={(value) => onSpecificationChange("aspect_ratio", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Brightness</Label>
            <Input
              value={specifications.brightness}
              onChange={(e) => onSpecificationChange("brightness", e.target.value)}
              placeholder="e.g., 250 cd/m²"
            />
          </div>

          <div className="space-y-2">
            <Label>Contrast Ratio</Label>
            <Input
              value={specifications.contrast_ratio}
              onChange={(e) => onSpecificationChange("contrast_ratio", e.target.value)}
              placeholder="e.g., 1000:1"
            />
          </div>

          <div className="space-y-2">
            <Label>Viewing Angle</Label>
            <Input
              value={specifications.viewing_angle}
              onChange={(e) => onSpecificationChange("viewing_angle", e.target.value)}
              placeholder="e.g., 178°/178°"
            />
          </div>
        </div>
      </div>

      {/* Connectivity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Connectivity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>HDMI Ports</Label>
            <Input
              type="number"
              min="0"
              value={specifications.hdmi_ports}
              onChange={(e) => onSpecificationChange("hdmi_ports", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>VGA Ports</Label>
            <Input
              type="number"
              min="0"
              value={specifications.vga_ports}
              onChange={(e) => onSpecificationChange("vga_ports", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>DisplayPort</Label>
            <Input
              type="number"
              min="0"
              value={specifications.display_port}
              onChange={(e) => onSpecificationChange("display_port", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>USB Ports</Label>
            <Input
              type="number"
              min="0"
              value={specifications.usb_ports}
              onChange={(e) => onSpecificationChange("usb_ports", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label>Audio Output (3.5mm)</Label>
            <Switch
              checked={specifications.audio_output}
              onCheckedChange={(checked) => onSpecificationChange("audio_output", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label>Built-in Speakers</Label>
            <Switch
              checked={specifications.built_in_speakers}
              onCheckedChange={(checked) => onSpecificationChange("built_in_speakers", checked)}
            />
          </div>
        </div>
      </div>

      {/* Mounting & Ergonomics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Mounting & Ergonomics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label>VESA Mount Compatible</Label>
              <p className="text-sm text-muted-foreground">Can be wall/arm mounted</p>
            </div>
            <Switch
              checked={specifications.vesa_mount}
              onCheckedChange={(checked) => onSpecificationChange("vesa_mount", checked)}
            />
          </div>

          {specifications.vesa_mount && (
            <div className="space-y-2">
              <Label>VESA Size (mm)</Label>
              <Select
                value={specifications.vesa_size}
                onValueChange={(value) => onSpecificationChange("vesa_size", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select VESA size" />
                </SelectTrigger>
                <SelectContent>
                  {VESA_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label>Tilt Adjustable</Label>
            <Switch
              checked={specifications.tilt_adjustable}
              onCheckedChange={(checked) => onSpecificationChange("tilt_adjustable", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label>Height Adjustable</Label>
            <Switch
              checked={specifications.height_adjustable}
              onCheckedChange={(checked) => onSpecificationChange("height_adjustable", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label>Pivot Rotation</Label>
            <Switch
              checked={specifications.pivot_rotation}
              onCheckedChange={(checked) => onSpecificationChange("pivot_rotation", checked)}
            />
          </div>
        </div>
      </div>

      {/* Power */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Power</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Power Consumption</Label>
            <Input
              value={specifications.power_consumption}
              onChange={(e) => onSpecificationChange("power_consumption", e.target.value)}
              placeholder="e.g., 25W"
            />
          </div>
        </div>
      </div>

      {/* Quotation Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Quotation Settings</h3>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label>Allow in Quotation Builder</Label>
            <p className="text-sm text-muted-foreground">Enable this to make this product available in the CCTV Quotation Builder</p>
          </div>
          <Switch
            checked={specifications.allow_in_quotation}
            onCheckedChange={(checked) => onSpecificationChange("allow_in_quotation", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default MonitorFields;
