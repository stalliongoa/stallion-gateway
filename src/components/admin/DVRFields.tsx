import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface DVRFieldsProps {
  specs: Record<string, any>;
  onSpecChange: (key: string, value: any) => void;
}

export const validateDVRSpecs = (specs: Record<string, any>): string[] => {
  const errors: string[] = [];
  const required = [
    { key: 'channel_capacity', label: 'Channel Capacity' },
    { key: 'supported_camera_resolution', label: 'Supported Camera Resolution' },
    { key: 'sata_ports', label: 'SATA Ports' },
    { key: 'power_supply_type', label: 'Power Supply Type' },
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

export const DVRFields = ({ specs, onSpecChange }: DVRFieldsProps) => {
  const handleMultiSelect = (key: string, value: string, checked: boolean) => {
    const current = specs[key] || [];
    if (checked) {
      onSpecChange(key, [...current, value]);
    } else {
      onSpecChange(key, current.filter((v: string) => v !== value));
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 2: System Classification */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">System Classification</h3>
          <Badge variant="secondary">Auto-set</Badge>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Supported CCTV System Type</Label>
            <Input value="Analog" disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">DVR supports Analog CCTV only</p>
          </div>
        </div>
      </div>

      {/* Section 3: Channel & Recording Capacity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Channel & Recording Capacity</h3>
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
              {['2 MP', '4 MP', '5 MP', '8 MP'].map((res) => (
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
            <Label>Recording Resolution</Label>
            <Select value={specs.recording_resolution || ''} onValueChange={(v) => onSpecChange('recording_resolution', v)}>
              <SelectTrigger><SelectValue placeholder="Select resolution" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1080N">1080N</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="4MP">4MP</SelectItem>
                <SelectItem value="5MP">5MP</SelectItem>
                <SelectItem value="8MP">8MP</SelectItem>
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
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Max HDD Capacity per SATA</Label>
            <Select value={specs.max_hdd_capacity || ''} onValueChange={(v) => onSpecChange('max_hdd_capacity', v)}>
              <SelectTrigger><SelectValue placeholder="Select capacity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="4TB">4 TB</SelectItem>
                <SelectItem value="6TB">6 TB</SelectItem>
                <SelectItem value="8TB">8 TB</SelectItem>
                <SelectItem value="10TB">10 TB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Supported HDD Type</Label>
            <Select value={specs.supported_hdd_type || ''} onValueChange={(v) => onSpecChange('supported_hdd_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select HDD type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="surveillance">Surveillance HDD Only</SelectItem>
                <SelectItem value="any_sata">Any SATA HDD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section 5: Power Supply Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Power Supply Details</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-destructive">Power Supply Type *</Label>
            <Select value={specs.power_supply_type || ''} onValueChange={(v) => onSpecChange('power_supply_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select power supply" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="4ch_smps">4 Channel SMPS</SelectItem>
                <SelectItem value="8ch_smps">8 Channel SMPS</SelectItem>
                <SelectItem value="16ch_smps">16 Channel SMPS</SelectItem>
                <SelectItem value="external_adapter">External Adapter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Power Input</Label>
            <Input
              value={specs.power_input || '12V DC'}
              onChange={(e) => onSpecChange('power_input', e.target.value)}
              placeholder="e.g., 12V DC"
            />
          </div>
        </div>
      </div>

      {/* Section 6: Video Input / Output */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Video Input / Output</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Video Input Type</Label>
            <div className="flex flex-wrap gap-3 p-3 border rounded-md">
              {['BNC', 'AHD', 'CVI', 'TVI'].map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    checked={(specs.video_input_type || []).includes(type)}
                    onCheckedChange={(checked) => handleMultiSelect('video_input_type', type, !!checked)}
                  />
                  <Label className="text-sm font-normal">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Video Output Ports</Label>
            <div className="flex flex-wrap gap-3 p-3 border rounded-md">
              {['HDMI', 'VGA', 'CVBS'].map((port) => (
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
      </div>

      {/* Section 7: Audio Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Audio Features</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {(specs.audio_input || specs.audio_output) && (
            <div className="space-y-2">
              <Label>Audio Channels</Label>
              <Select value={specs.audio_channels || ''} onValueChange={(v) => onSpecChange('audio_channels', v)}>
                <SelectTrigger><SelectValue placeholder="Select channels" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Section 8: Network & Remote Access */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Network & Remote Access</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>LAN Port</Label>
            <Select value={specs.lan_port || ''} onValueChange={(v) => onSpecChange('lan_port', v)}>
              <SelectTrigger><SelectValue placeholder="Select LAN speed" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10/100">10/100 Mbps</SelectItem>
                <SelectItem value="gigabit">Gigabit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label>Remote Viewing</Label>
            <Switch
              checked={specs.remote_viewing === true}
              onCheckedChange={(v) => onSpecChange('remote_viewing', v)}
            />
          </div>

          <div className="space-y-2">
            <Label>Mobile App Support</Label>
            <Input
              value={specs.mobile_app || ''}
              onChange={(e) => onSpecChange('mobile_app', e.target.value)}
              placeholder="e.g., XMEye, Hik-Connect"
            />
          </div>
        </div>
      </div>

      {/* Section 9: AI & Smart Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI & Smart Features</h3>
        <Separator />
        <div className="space-y-2">
          <Label>AI Features</Label>
          <div className="flex flex-wrap gap-3 p-3 border rounded-md">
            {['Motion Detection', 'Human Detection', 'Line Crossing', 'Intrusion Alert'].map((feature) => (
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
