import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface SMPSFieldsProps {
  specifications: Record<string, any>;
  onSpecificationChange: (key: string, value: any) => void;
}

export const validateSMPSSpecs = (specifications: Record<string, any>): string | null => {
  if (!specifications.channels) {
    return "Channels is required for SMPS";
  }
  if (!specifications.output_voltage) {
    return "Output voltage is required for SMPS";
  }
  if (!specifications.amperage) {
    return "Amperage is required for SMPS";
  }
  if (specifications.metal_body === undefined || specifications.metal_body === null) {
    return "Metal body selection is required";
  }
  return null;
};

const SMPSFields = ({ specifications, onSpecificationChange }: SMPSFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">SMPS (Power Supply) Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Channels <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.channels || ""}
              onValueChange={(value) => onSpecificationChange("channels", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="16">16</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Output Voltage <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.output_voltage || ""}
              onValueChange={(value) => onSpecificationChange("output_voltage", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select voltage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12V">12V</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amperage <span className="text-destructive">*</span></Label>
            <Input
              value={specifications.amperage || ""}
              onChange={(e) => onSpecificationChange("amperage", e.target.value)}
              placeholder="e.g., 5A, 10A, 20A"
            />
          </div>

          <div className="space-y-2">
            <Label>Metal Body <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.metal_body === true ? "yes" : specifications.metal_body === false ? "no" : ""}
              onValueChange={(value) => onSpecificationChange("metal_body", value === "yes")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
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

export default SMPSFields;
