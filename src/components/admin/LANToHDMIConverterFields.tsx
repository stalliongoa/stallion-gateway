import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface LANToHDMIConverterFieldsProps {
  specifications: Record<string, any>;
  onSpecificationChange: (key: string, value: any) => void;
}

export const validateLANToHDMIConverterSpecs = (specifications: Record<string, any>): string | null => {
  if (!specifications.max_distance) {
    return "Max distance is required";
  }
  if (!specifications.resolution_support) {
    return "Resolution support is required";
  }
  if (!specifications.power_supply) {
    return "Power supply is required";
  }
  return null;
};

const LANToHDMIConverterFields = ({ specifications, onSpecificationChange }: LANToHDMIConverterFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">LAN to HDMI Converter Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Max Distance <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.max_distance || ""}
              onValueChange={(value) => onSpecificationChange("max_distance", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select max distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50m">50m</SelectItem>
                <SelectItem value="100m">100m</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Resolution Support <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.resolution_support || ""}
              onValueChange={(value) => onSpecificationChange("resolution_support", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="4K">4K</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Power Supply <span className="text-destructive">*</span></Label>
            <Input
              value={specifications.power_supply || ""}
              onChange={(e) => onSpecificationChange("power_supply", e.target.value)}
              placeholder="e.g., 5V DC Adapter"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Quotation Settings</h3>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label>Allow in Quotation Builder</Label>
            <p className="text-sm text-muted-foreground">Enable this to make this product available in the CCTV Quotation Builder</p>
          </div>
          <Switch
            checked={specifications.allow_in_quotation || false}
            onCheckedChange={(checked) => onSpecificationChange("allow_in_quotation", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default LANToHDMIConverterFields;
