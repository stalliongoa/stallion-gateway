import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface HDDFieldsProps {
  specs: Record<string, any>;
  onSpecChange: (key: string, value: any) => void;
}

export const validateHDDSpecs = (specs: Record<string, any>): string[] => {
  const errors: string[] = [];
  const required = [
    { key: 'storage_capacity', label: 'Storage Capacity' },
    { key: 'hdd_type', label: 'HDD Type' },
    { key: 'compatible_with', label: 'Compatible With (DVR/NVR)' },
  ];

  required.forEach(({ key, label }) => {
    const value = specs[key];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      errors.push(`${label} is required`);
    }
  });

  return errors;
};

export const HDDFields = ({ specs, onSpecChange }: HDDFieldsProps) => {
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
      {/* Section 2: Storage Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Storage Specifications</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-destructive">Storage Capacity *</Label>
            <Select value={specs.storage_capacity || ''} onValueChange={(v) => onSpecChange('storage_capacity', v)}>
              <SelectTrigger><SelectValue placeholder="Select capacity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1TB">1 TB</SelectItem>
                <SelectItem value="2TB">2 TB</SelectItem>
                <SelectItem value="4TB">4 TB</SelectItem>
                <SelectItem value="6TB">6 TB</SelectItem>
                <SelectItem value="8TB">8 TB</SelectItem>
                <SelectItem value="10TB">10 TB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-destructive">HDD Type *</Label>
            <Select value={specs.hdd_type || ''} onValueChange={(v) => onSpecChange('hdd_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="surveillance">Surveillance HDD</SelectItem>
                <SelectItem value="enterprise">Enterprise HDD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>RPM</Label>
            <Select value={specs.rpm || ''} onValueChange={(v) => onSpecChange('rpm', v)}>
              <SelectTrigger><SelectValue placeholder="Select RPM" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5400">5400 RPM</SelectItem>
                <SelectItem value="7200">7200 RPM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cache Memory</Label>
            <Select value={specs.cache_memory || ''} onValueChange={(v) => onSpecChange('cache_memory', v)}>
              <SelectTrigger><SelectValue placeholder="Select cache" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="64MB">64 MB</SelectItem>
                <SelectItem value="128MB">128 MB</SelectItem>
                <SelectItem value="256MB">256 MB</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section 3: Compatibility */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Compatibility</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-destructive">Compatible With *</Label>
            <div className="flex flex-wrap gap-3 p-3 border rounded-md">
              {['DVR', 'NVR', 'Both'].map((device) => (
                <div key={device} className="flex items-center gap-2">
                  <Checkbox
                    checked={(specs.compatible_with || []).includes(device)}
                    onCheckedChange={(checked) => handleMultiSelect('compatible_with', device, !!checked)}
                  />
                  <Label className="text-sm font-normal">{device}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Max Cameras Supported</Label>
            <Input
              type="number"
              value={specs.max_cameras || ''}
              onChange={(e) => onSpecChange('max_cameras', e.target.value)}
              placeholder="e.g., 8, 16, 32"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Interface & Power */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interface & Power</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Interface Type</Label>
            <Select value={specs.interface_type || ''} onValueChange={(v) => onSpecChange('interface_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select interface" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sata2">SATA II</SelectItem>
                <SelectItem value="sata3">SATA III</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Power Consumption</Label>
            <Input
              value={specs.power_consumption || ''}
              onChange={(e) => onSpecChange('power_consumption', e.target.value)}
              placeholder="e.g., 5W"
            />
          </div>
        </div>
      </div>

      {/* Section 5: Reliability & Usage */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reliability & Usage</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label>24x7 Operation Rated</Label>
            <Switch
              checked={specs.operation_24x7 === true}
              onCheckedChange={(v) => onSpecChange('operation_24x7', v)}
            />
          </div>

          <div className="space-y-2">
            <Label>Workload Rating</Label>
            <Select value={specs.workload_rating || ''} onValueChange={(v) => onSpecChange('workload_rating', v)}>
              <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="heavy_duty">Heavy Duty</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="3_years">3 Years</SelectItem>
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
