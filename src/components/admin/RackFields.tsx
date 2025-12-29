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

interface RackFieldsProps {
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

const RACK_TYPES = ['Wall Mount', 'Floor Mount'];

const SIZE_OPTIONS = ['4U', '6U', '9U', '12U', '15U', '18U', '22U', '42U'];

const MATERIAL_OPTIONS = ['Metal', 'Steel', 'Aluminum'];

const COMPATIBLE_DEVICES = ['DVR', 'NVR', 'Switch', 'Server', 'UPS', 'Patch Panel'];

const WARRANTY_OPTIONS = ['6 Months', '1 Year', '2 Years', '3 Years'];

export function RackFields({
  specs,
  onChange,
  vendors,
  formData,
  onFormDataChange,
}: RackFieldsProps) {
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
          <CardTitle className="text-lg">Rack Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Rack Type *</Label>
            <Select
              value={specs.rack_type || ''}
              onValueChange={(v) => handleChange('rack_type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rack type" />
              </SelectTrigger>
              <SelectContent>
                {RACK_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Size (U) *</Label>
            <Select
              value={specs.size_u || ''}
              onValueChange={(v) => handleChange('size_u', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Material *</Label>
            <Select
              value={specs.material || ''}
              onValueChange={(v) => handleChange('material', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_OPTIONS.map((mat) => (
                  <SelectItem key={mat} value={mat}>
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compatibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="mb-3 block">Compatible With</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

      {/* Section 3: Inventory & Pricing */}
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

      {/* Section 4: Warranty */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Warranty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
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
        </CardContent>
      </Card>

      {/* Section 5: Status & Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status & Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow in Quotation Builder *</Label>
              <p className="text-sm text-muted-foreground">
                Enable this rack for CCTV quotation wizard
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

export function validateRackSpecs(specs: Record<string, any>): string[] {
  const errors: string[] = [];

  if (!specs.rack_type) errors.push('Rack Type is required');
  if (!specs.size_u) errors.push('Size (U) is required');
  if (!specs.material) errors.push('Material is required');

  return errors;
}
