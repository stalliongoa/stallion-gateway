import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface UPSFieldsProps {
  specs: Record<string, any>;
  onSpecChange: (key: string, value: any) => void;
}

export const validateUPSSpecs = (specs: Record<string, any>): string[] => {
  const errors: string[] = [];
  const required = [
    { key: 'ups_type', label: 'UPS Type' },
    { key: 'capacity_va', label: 'Capacity (VA)' },
  ];

  required.forEach(({ key, label }) => {
    const value = specs[key];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      errors.push(`${label} is required`);
    }
  });

  return errors;
};

export const UPSFields = ({ specs, onSpecChange }: UPSFieldsProps) => {
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
      {/* Section 2: Power Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Power Specifications</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-destructive">UPS Type *</Label>
            <Select value={specs.ups_type || ''} onValueChange={(v) => onSpecChange('ups_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="line_interactive">Line Interactive</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-destructive">Capacity (VA) *</Label>
            <Select value={specs.capacity_va || ''} onValueChange={(v) => onSpecChange('capacity_va', v)}>
              <SelectTrigger><SelectValue placeholder="Select capacity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="600">600 VA</SelectItem>
                <SelectItem value="800">800 VA</SelectItem>
                <SelectItem value="1000">1 KVA</SelectItem>
                <SelectItem value="2000">2 KVA</SelectItem>
                <SelectItem value="3000">3 KVA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Output Power (Watts)</Label>
            <Input
              type="number"
              value={specs.output_power_watts || ''}
              onChange={(e) => onSpecChange('output_power_watts', e.target.value)}
              placeholder="e.g., 360"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Backup Performance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Backup Performance</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Backup Time @ Load</Label>
            <Select value={specs.backup_time || ''} onValueChange={(v) => onSpecChange('backup_time', v)}>
              <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 min</SelectItem>
                <SelectItem value="30min">30 min</SelectItem>
                <SelectItem value="1hour">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Battery Type</Label>
            <Select value={specs.battery_type || ''} onValueChange={(v) => onSpecChange('battery_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sealed_lead_acid">Sealed Lead Acid</SelectItem>
                <SelectItem value="lithium">Lithium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Number of Batteries</Label>
            <Input
              type="number"
              value={specs.battery_count || ''}
              onChange={(e) => onSpecChange('battery_count', e.target.value)}
              placeholder="e.g., 1"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Input / Output */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Input / Output</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Input Voltage Range</Label>
            <Input
              value={specs.input_voltage_range || ''}
              onChange={(e) => onSpecChange('input_voltage_range', e.target.value)}
              placeholder="e.g., 140V–300V"
            />
          </div>

          <div className="space-y-2">
            <Label>Output Voltage</Label>
            <Input
              value={specs.output_voltage || '230V AC'}
              onChange={(e) => onSpecChange('output_voltage', e.target.value)}
              placeholder="e.g., 230V AC"
            />
          </div>

          <div className="space-y-2">
            <Label>Socket Type</Label>
            <Select value={specs.socket_type || ''} onValueChange={(v) => onSpecChange('socket_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select socket" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="indian_3pin">Indian 3-Pin</SelectItem>
                <SelectItem value="iec">IEC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section 5: Usage Compatibility */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Usage Compatibility</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Recommended For</Label>
            <div className="flex flex-wrap gap-3 p-3 border rounded-md">
              {['CCTV System', 'DVR/NVR', 'Router', 'Monitor'].map((device) => (
                <div key={device} className="flex items-center gap-2">
                  <Checkbox
                    checked={(specs.recommended_for || []).includes(device)}
                    onCheckedChange={(checked) => handleMultiSelect('recommended_for', device, !!checked)}
                  />
                  <Label className="text-sm font-normal">{device}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Max Load Supported (Watts)</Label>
            <Input
              value={specs.max_load_watts || ''}
              onChange={(e) => onSpecChange('max_load_watts', e.target.value)}
              placeholder="e.g., 360W"
            />
          </div>
        </div>
      </div>

      {/* Section 7: Warranty & Documents */}
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

      {/* Section 8: Status & Visibility */}
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
