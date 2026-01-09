import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface NVRFieldsProps {
  specs: Record<string, any>;
  onSpecChange: (key: string, value: any) => void;
}

// Quick fill defaults for NVR
const getNVRQuickFillDefaults = (channelCapacity: string): Record<string, any> => {
  const baseDefaults: Record<string, any> = {
    supported_camera_resolution: ['2 MP', '4 MP', '5 MP', '8 MP'],
    incoming_bandwidth: '80Mbps',
    max_hdd_capacity: '8TB',
    raid_support: false,
    poe_standard: '802.3af',
    lan_ports: '1x_gigabit',
    video_output_ports: ['HDMI', 'VGA'],
    audio_input: true,
    audio_output: true,
    ai_features: ['Motion Detection', 'Human Detection'],
    onvif_support: true,
    mobile_app: 'DMSS / Hik-Connect',
    body_material: 'metal',
    cooling_fan: true,
    warranty_period: '1_year',
    allow_in_quotation: true,
  };

  // Set PoE ports and SATA based on channel capacity
  switch (channelCapacity) {
    case '4':
      return { ...baseDefaults, poe_ports: '4', sata_ports: '1' };
    case '8':
      return { ...baseDefaults, poe_ports: '8', sata_ports: '1' };
    case '16':
      return { ...baseDefaults, poe_ports: '16', sata_ports: '2', incoming_bandwidth: '160Mbps' };
    case '32':
      return { ...baseDefaults, poe_ports: 'none', sata_ports: '4', incoming_bandwidth: '320Mbps' };
    default:
      return baseDefaults;
  }
};

export const validateNVRSpecs = (specs: Record<string, any>): string[] => {
  const errors: string[] = [];
  const required = [
    { key: 'channel_capacity', label: 'Channel Capacity' },
    { key: 'supported_camera_resolution', label: 'Supported Camera Resolution' },
    { key: 'sata_ports', label: 'SATA Ports' },
    { key: 'body_material', label: 'Body Material' },
  ];

  required.forEach(({ key, label }) => {
    const value = specs[key];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      errors.push(`${label} is required`);
    }
  });

  return errors;
};

export const NVRFields = ({ specs, onSpecChange }: NVRFieldsProps) => {
  const handleMultiSelect = (key: string, value: string, checked: boolean) => {
    const current = specs[key] || [];
    if (checked) {
      onSpecChange(key, [...current, value]);
    } else {
      onSpecChange(key, current.filter((v: string) => v !== value));
    }
  };

  const handleQuickFillDefaults = () => {
    const defaults = getNVRQuickFillDefaults(specs.channel_capacity || '8');
    // Only fill empty fields, preserve already filled values
    Object.entries(defaults).forEach(([key, value]) => {
      const currentValue = specs[key];
      if (
        currentValue === '' ||
        currentValue === undefined ||
        currentValue === null ||
        currentValue === false ||
        (Array.isArray(currentValue) && currentValue.length === 0)
      ) {
        onSpecChange(key, value);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Section 2: System Classification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">System Classification</h3>
            <Badge variant="secondary">Auto-set</Badge>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleQuickFillDefaults}
            className="gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Quick Fill Defaults
          </Button>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Supported CCTV System Type</Label>
            <Input value="IP" disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">NVR supports IP CCTV only</p>
          </div>
        </div>
      </div>

      {/* Section 3: Channel & Camera Support */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Channel & Camera Support</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-destructive">Channel Capacity *</Label>
            <Select value={specs.channel_capacity || ''} onValueChange={(v) => onSpecChange('channel_capacity', v)}>
              <SelectTrigger><SelectValue placeholder="Select channels" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 Channel</SelectItem>
                <SelectItem value="8">8 Channel</SelectItem>
                <SelectItem value="16">16 Channel</SelectItem>
                <SelectItem value="32">32 Channel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-destructive">Supported Camera Resolution *</Label>
            <div className="flex flex-wrap gap-3 p-3 border rounded-md">
              {['2 MP', '4 MP', '5 MP', '8 MP', '12 MP'].map((res) => (
                <div key={res} className="flex items-center gap-2">
                  <Checkbox
                    checked={(specs.supported_camera_resolution || []).includes(res)}
                    onCheckedChange={(checked) => handleMultiSelect('supported_camera_resolution', res, !!checked)}
                  />
                  <Label className="text-sm font-normal">{res}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Incoming Bandwidth</Label>
            <Select value={specs.incoming_bandwidth || ''} onValueChange={(v) => onSpecChange('incoming_bandwidth', v)}>
              <SelectTrigger><SelectValue placeholder="Select bandwidth" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="40Mbps">40 Mbps</SelectItem>
                <SelectItem value="80Mbps">80 Mbps</SelectItem>
                <SelectItem value="160Mbps">160 Mbps</SelectItem>
                <SelectItem value="320Mbps">320 Mbps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section 4: Storage & Hard Disk Support */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Storage & Hard Disk Support</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-destructive">SATA Ports *</Label>
            <Select value={specs.sata_ports || ''} onValueChange={(v) => onSpecChange('sata_ports', v)}>
              <SelectTrigger><SelectValue placeholder="Select SATA ports" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 SATA</SelectItem>
                <SelectItem value="2">2 SATA</SelectItem>
                <SelectItem value="4">4 SATA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Max HDD Capacity per SATA</Label>
            <Select value={specs.max_hdd_capacity || ''} onValueChange={(v) => onSpecChange('max_hdd_capacity', v)}>
              <SelectTrigger><SelectValue placeholder="Select capacity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="6TB">6 TB</SelectItem>
                <SelectItem value="8TB">8 TB</SelectItem>
                <SelectItem value="10TB">10 TB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label>RAID Support</Label>
            <Switch
              checked={specs.raid_support === true}
              onCheckedChange={(v) => onSpecChange('raid_support', v)}
            />
          </div>
        </div>
      </div>

      {/* Section 5: PoE & Network */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">PoE & Network</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Built-in PoE Ports</Label>
            <Select value={specs.poe_ports || ''} onValueChange={(v) => onSpecChange('poe_ports', v)}>
              <SelectTrigger><SelectValue placeholder="Select PoE ports" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="4">4 PoE</SelectItem>
                <SelectItem value="8">8 PoE</SelectItem>
                <SelectItem value="16">16 PoE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {specs.poe_ports && specs.poe_ports !== 'none' && (
            <div className="space-y-2">
              <Label>PoE Standard</Label>
              <Select value={specs.poe_standard || ''} onValueChange={(v) => onSpecChange('poe_standard', v)}>
                <SelectTrigger><SelectValue placeholder="Select standard" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="802.3af">IEEE 802.3af</SelectItem>
                  <SelectItem value="802.3at">IEEE 802.3at</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>LAN Ports</Label>
            <Select value={specs.lan_ports || ''} onValueChange={(v) => onSpecChange('lan_ports', v)}>
              <SelectTrigger><SelectValue placeholder="Select LAN ports" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1x_gigabit">1 x Gigabit</SelectItem>
                <SelectItem value="2x_gigabit">2 x Gigabit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section 6: Video Output */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Video Output</h3>
        <Separator />
        <div className="space-y-2">
          <Label>Video Output Ports</Label>
          <div className="flex flex-wrap gap-3 p-3 border rounded-md">
            {['HDMI', 'VGA', '4K HDMI'].map((port) => (
              <div key={port} className="flex items-center gap-2">
                <Checkbox
                  checked={(specs.video_output_ports || []).includes(port)}
                  onCheckedChange={(checked) => handleMultiSelect('video_output_ports', port, !!checked)}
                />
                <Label className="text-sm font-normal">{port}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 7: Audio Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Audio Features</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label>Audio Input</Label>
            <Switch
              checked={specs.audio_input === true}
              onCheckedChange={(v) => onSpecChange('audio_input', v)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label>Audio Output</Label>
            <Switch
              checked={specs.audio_output === true}
              onCheckedChange={(v) => onSpecChange('audio_output', v)}
            />
          </div>
        </div>
      </div>

      {/* Section 8: AI & Smart Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI & Smart Features</h3>
        <Separator />
        <div className="space-y-2">
          <Label>AI Features</Label>
          <div className="flex flex-wrap gap-3 p-3 border rounded-md">
            {['Motion Detection', 'Face Detection', 'Human Detection', 'Vehicle Detection'].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Checkbox
                  checked={(specs.ai_features || []).includes(feature)}
                  onCheckedChange={(checked) => handleMultiSelect('ai_features', feature, !!checked)}
                />
                <Label className="text-sm font-normal">{feature}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 9: Remote Access */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Remote Access</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label>ONVIF Support</Label>
            <Switch
              checked={specs.onvif_support === true}
              onCheckedChange={(v) => onSpecChange('onvif_support', v)}
            />
          </div>

          <div className="space-y-2">
            <Label>Mobile App Support</Label>
            <Input
              value={specs.mobile_app || ''}
              onChange={(e) => onSpecChange('mobile_app', e.target.value)}
              placeholder="e.g., Hik-Connect, DMSS"
            />
          </div>
        </div>
      </div>

      {/* Section 10: Hardware & Build */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Hardware & Build</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-destructive">Body Material *</Label>
            <Select value={specs.body_material || ''} onValueChange={(v) => onSpecChange('body_material', v)}>
              <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="plastic">Plastic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label>Cooling Fan</Label>
            <Switch
              checked={specs.cooling_fan === true}
              onCheckedChange={(v) => onSpecChange('cooling_fan', v)}
            />
          </div>
        </div>
      </div>

      {/* Section 12: Warranty & Documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Warranty & Documents</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Warranty Period</Label>
            <Select value={specs.warranty_period || ''} onValueChange={(v) => onSpecChange('warranty_period', v)}>
              <SelectTrigger><SelectValue placeholder="Select warranty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1_year">1 Year</SelectItem>
                <SelectItem value="2_years">2 Years</SelectItem>
                <SelectItem value="3_years">3 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section 13: Status & Visibility */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status & Visibility</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label className="text-destructive">Allow in Quotation Builder *</Label>
            <Switch
              checked={specs.allow_in_quotation !== false}
              onCheckedChange={(v) => onSpecChange('allow_in_quotation', v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
