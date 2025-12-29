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

interface PoESwitchFieldsProps {
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

const TOTAL_PORTS = ['4', '8', '16', '24', '48'];
const POE_PORTS = ['4', '8', '16', '24'];
const POE_STANDARDS = ['IEEE 802.3af', 'IEEE 802.3at', 'IEEE 802.3bt'];
const WARRANTY_OPTIONS = ['1 Year', '2 Years', '3 Years'];

export function PoESwitchFields({
  specs,
  onChange,
  vendors,
  formData,
  onFormDataChange,
}: PoESwitchFieldsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...specs, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Switch Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Model *</Label>
            <Input
              value={specs.model || ''}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="e.g., GS108PE"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Network Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Network Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Total Ports *</Label>
            <Select
              value={specs.total_ports || ''}
              onValueChange={(v) => handleChange('total_ports', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ports" />
              </SelectTrigger>
              <SelectContent>
                {TOTAL_PORTS.map((port) => (
                  <SelectItem key={port} value={port}>
                    {port} Ports
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>PoE Ports *</Label>
            <Select
              value={specs.poe_ports || ''}
              onValueChange={(v) => handleChange('poe_ports', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select PoE ports" />
              </SelectTrigger>
              <SelectContent>
                {POE_PORTS.map((port) => (
                  <SelectItem key={port} value={port}>
                    {port} PoE Ports
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>PoE Standard *</Label>
            <Select
              value={specs.poe_standard || ''}
              onValueChange={(v) => handleChange('poe_standard', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select standard" />
              </SelectTrigger>
              <SelectContent>
                {POE_STANDARDS.map((std) => (
                  <SelectItem key={std} value={std}>
                    {std}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Managed Switch *</Label>
            <Select
              value={specs.is_managed || ''}
              onValueChange={(v) => handleChange('is_managed', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes (Managed)</SelectItem>
                <SelectItem value="no">No (Unmanaged)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Total PoE Power (W)</Label>
            <Input
              value={specs.total_poe_power || ''}
              onChange={(e) => handleChange('total_poe_power', e.target.value)}
              placeholder="e.g., 120"
            />
          </div>
          <div>
            <Label>Uplink Ports</Label>
            <Input
              value={specs.uplink_ports || ''}
              onChange={(e) => handleChange('uplink_ports', e.target.value)}
              placeholder="e.g., 2 x SFP"
            />
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
                Enable this switch for CCTV quotation wizard
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

export function validatePoESwitchSpecs(specs: Record<string, any>): string[] {
  const errors: string[] = [];

  if (!specs.total_ports) errors.push('Total Ports is required');
  if (!specs.poe_ports) errors.push('PoE Ports is required');
  if (!specs.poe_standard) errors.push('PoE Standard is required');
  if (!specs.is_managed) errors.push('Managed selection is required');

  return errors;
}
