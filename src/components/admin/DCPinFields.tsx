import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface DCPinFieldsProps {
  specifications: Record<string, any>;
  onSpecificationChange: (key: string, value: any) => void;
}

export const validateDCPinSpecs = (specifications: Record<string, any>): string | null => {
  if (!specifications.pin_type) {
    return "Pin type is required for DC Pin";
  }
  if (!specifications.voltage_rating) {
    return "Voltage rating is required for DC Pin";
  }
  if (!specifications.pack_size || specifications.pack_size < 1) {
    return "Pack size is required and must be at least 1";
  }
  return null;
};

const DCPinFields = ({ specifications, onSpecificationChange }: DCPinFieldsProps) => {
  return (
    <div className="space-y-6">
      {/* Section: Pin Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">DC Pin Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pin Type */}
          <div className="space-y-2">
            <Label htmlFor="pin_type">
              Pin Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={specifications.pin_type || ""}
              onValueChange={(value) => onSpecificationChange("pin_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pin type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Voltage Rating */}
          <div className="space-y-2">
            <Label htmlFor="voltage_rating">
              Voltage Rating <span className="text-destructive">*</span>
            </Label>
            <Select
              value={specifications.voltage_rating || ""}
              onValueChange={(value) => onSpecificationChange("voltage_rating", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select voltage rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12V">12V</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pack Size */}
          <div className="space-y-2">
            <Label htmlFor="pack_size">
              Pack Size <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pack_size"
              type="number"
              min="1"
              value={specifications.pack_size || ""}
              onChange={(e) => onSpecificationChange("pack_size", parseInt(e.target.value) || 0)}
              placeholder="e.g., 100"
            />
          </div>
        </div>
      </div>

      {/* Section: Quotation Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Quotation Settings</h3>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="allow_in_quotation">Allow in Quotation Builder</Label>
            <p className="text-sm text-muted-foreground">
              Enable this to make this product available in the CCTV Quotation Builder
            </p>
          </div>
          <Switch
            id="allow_in_quotation"
            checked={specifications.allow_in_quotation || false}
            onCheckedChange={(checked) => onSpecificationChange("allow_in_quotation", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default DCPinFields;
