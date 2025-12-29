import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

interface CableFieldsProps {
  specs: Record<string, any>;
  onChange: (specs: Record<string, any>) => void;
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

const CABLE_CATEGORIES = [
  'CCTV Coaxial',
  'LAN',
  'HDMI',
  'Power Cable',
];

const CABLE_TYPES = [
  'RG59',
  'RG6',
  'Cat5e',
  'Cat6',
  'Cat6a',
  'HDMI',
  'Power',
];

const LENGTH_OPTIONS = [
  'Per Meter',
  '5 m',
  '10 m',
  '15 m',
  '20 m',
  '30 m',
  '50 m',
  '100 m',
  '305 m (Box)',
];

const CONDUCTOR_MATERIALS = [
  'Copper',
  'CCA (Copper Clad Aluminum)',
];

const SHIELDING_OPTIONS = [
  'Unshielded (UTP)',
  'Single Shielded (FTP)',
  'Double Shielded (STP)',
];

const COMPATIBLE_DEVICES = [
  'CCTV Camera',
  'DVR',
  'NVR',
  'Monitor',
  'Network Devices',
  'Router',
  'Switch',
];

const WARRANTY_OPTIONS = [
  '6 Months',
  '1 Year',
  '2 Years',
  '3 Years',
];

export function CableFields({
  specs,
  onChange,
  vendors,
  formData,
  onFormDataChange,
}: CableFieldsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...specs, [key]: value });
  };

  const handleMultiSelect = (key: string, value: string, checked: boolean) => {
    const current = specs[key] || [];
    if (checked) {
      handleChange(key, [...current, value]);
    } else {
      handleChange(key, current.filter((v: string) => v !== value));
    }
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cable Category</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Cable Category *</Label>
            <Select
              value={specs.cable_category || ''}
              onValueChange={(v) => handleChange('cable_category', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cable category" />
              </SelectTrigger>
              <SelectContent>
                {CABLE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Model / Part Number</Label>
            <Input
              value={specs.model_number || ''}
              onChange={(e) => handleChange('model_number', e.target.value)}
              placeholder="e.g., CAT6-305M-CU"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Cable Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cable Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Cable Type *</Label>
            <Select
              value={specs.cable_type || ''}
              onValueChange={(v) => handleChange('cable_type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cable type" />
              </SelectTrigger>
              <SelectContent>
                {CABLE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Length *</Label>
            <Select
              value={specs.length || ''}
              onValueChange={(v) => handleChange('length', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                {LENGTH_OPTIONS.map((len) => (
                  <SelectItem key={len} value={len}>
                    {len}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Conductor Material</Label>
            <Select
              value={specs.conductor_material || ''}
              onValueChange={(v) => handleChange('conductor_material', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {CONDUCTOR_MATERIALS.map((mat) => (
                  <SelectItem key={mat} value={mat}>
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Shielding</Label>
            <Select
              value={specs.shielding || ''}
              onValueChange={(v) => handleChange('shielding', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shielding" />
              </SelectTrigger>
              <SelectContent>
                {SHIELDING_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compatibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="mb-3 block">Compatible With</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {COMPATIBLE_DEVICES.map((device) => (
                <div key={device} className="flex items-center space-x-2">
                  <Checkbox
                    id={`compatible-${device}`}
                    checked={(specs.compatible_with || []).includes(device)}
                    onCheckedChange={(checked) =>
                      handleMultiSelect('compatible_with', device, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`compatible-${device}`}
                    className="text-sm cursor-pointer"
                  >
                    {device}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Inventory & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inventory & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Vendor / Supplier *</Label>
            <Select
              value={formData.vendor_id}
              onValueChange={(v) => onFormDataChange('vendor_id', v)}
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
          <div>
            <Label>Purchase Price (₹) *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.purchase_price}
              onChange={(e) => onFormDataChange('purchase_price', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>Selling Price (₹) *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.selling_price}
              onChange={(e) => onFormDataChange('selling_price', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>GST %</Label>
            <Select
              value={formData.tax_rate}
              onValueChange={(v) => onFormDataChange('tax_rate', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Stock Quantity *</Label>
            <Input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => onFormDataChange('stock_quantity', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label>Minimum Stock Alert</Label>
            <Input
              type="number"
              value={formData.low_stock_threshold}
              onChange={(e) => onFormDataChange('low_stock_threshold', e.target.value)}
              placeholder="5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Warranty & Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Warranty & Documents</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Warranty Period</Label>
            <Select
              value={specs.warranty_period || ''}
              onValueChange={(v) => handleChange('warranty_period', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select warranty" />
              </SelectTrigger>
              <SelectContent>
                {WARRANTY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Datasheet URL</Label>
            <Input
              value={specs.datasheet_url || ''}
              onChange={(e) => handleChange('datasheet_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Status & Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status & Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Product Status</Label>
              <p className="text-sm text-muted-foreground">
                Active products are visible in the store
              </p>
            </div>
            <Switch
              checked={specs.is_active !== false}
              onCheckedChange={(checked) => handleChange('is_active', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow in Quotation Builder *</Label>
              <p className="text-sm text-muted-foreground">
                Enable this cable for CCTV quotation wizard
              </p>
            </div>
            <Switch
              checked={specs.allow_in_quotation !== false}
              onCheckedChange={(checked) => handleChange('allow_in_quotation', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function validateCableSpecs(specs: Record<string, any>): string[] {
  const errors: string[] = [];

  if (!specs.cable_category) errors.push('Cable Category is required');
  if (!specs.cable_type) errors.push('Cable Type is required');
  if (!specs.length) errors.push('Length is required');

  return errors;
}
