import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface BNCConnectorFieldsProps {
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

const CONNECTOR_TYPES = ['Crimp', 'Screw', 'Compression', 'Twist-on'];
const MATERIALS = ['Brass', 'Copper', 'Nickel Plated', 'Gold Plated'];
const COMPATIBLE_CABLES = ['RG59', 'RG6', 'RG59 + RG6'];
const PACK_SIZES = ['1 Pc', '10 Pcs', '25 Pcs', '50 Pcs', '100 Pcs'];

export function BNCConnectorFields({
  specs,
  onChange,
  vendors,
  formData,
  onFormDataChange,
}: BNCConnectorFieldsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...specs, [key]: value });
  };

  const handleQuickFillDefaults = () => {
    const updates: Record<string, any> = { ...specs };
    let filled = false;

    // Common BNC connector defaults
    if (!specs.connector_type) { updates.connector_type = 'Crimp'; filled = true; }
    if (!specs.material) { updates.material = 'Brass'; filled = true; }
    if (!specs.compatible_cable) { updates.compatible_cable = 'RG59'; filled = true; }
    if (!specs.pack_size) { updates.pack_size = '10 Pcs'; filled = true; }
    if (specs.allow_in_quotation === undefined) { updates.allow_in_quotation = true; filled = true; }

    if (filled) {
      onChange(updates);
      toast({
        title: "Defaults Applied",
        description: "BNC connector defaults have been applied.",
      });
    } else {
      toast({
        title: "No Changes",
        description: "All fields already have values.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Fill Defaults Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleQuickFillDefaults}
          className="gap-2"
        >
          <Wand2 className="h-4 w-4" />
          Quick Fill Defaults
        </Button>
      </div>

      {/* Section 1: Connector Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Connector Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Connector Type *</Label>
            <Select
              value={specs.connector_type || ''}
              onValueChange={(v) => handleChange('connector_type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CONNECTOR_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
                {MATERIALS.map((mat) => (
                  <SelectItem key={mat} value={mat}>
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Compatible Cable *</Label>
            <Select
              value={specs.compatible_cable || ''}
              onValueChange={(v) => handleChange('compatible_cable', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cable" />
              </SelectTrigger>
              <SelectContent>
                {COMPATIBLE_CABLES.map((cable) => (
                  <SelectItem key={cable} value={cable}>
                    {cable}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pack Size *</Label>
            <Select
              value={specs.pack_size || ''}
              onValueChange={(v) => handleChange('pack_size', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pack size" />
              </SelectTrigger>
              <SelectContent>
                {PACK_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Inventory & Pricing */}
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

      {/* Section 3: Status & Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status & Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow in Quotation Builder *</Label>
              <p className="text-sm text-muted-foreground">
                Enable this connector for CCTV quotation wizard
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

export function validateBNCConnectorSpecs(specs: Record<string, any>): string[] {
  const errors: string[] = [];

  if (!specs.connector_type) errors.push('Connector Type is required');
  if (!specs.material) errors.push('Material is required');
  if (!specs.compatible_cable) errors.push('Compatible Cable is required');
  if (!specs.pack_size) errors.push('Pack Size is required');

  return errors;
}
