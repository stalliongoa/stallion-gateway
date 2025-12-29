import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface HDMISplitterFieldsProps {
  specifications: Record<string, any>;
  onSpecificationChange: (key: string, value: any) => void;
}

export const validateHDMISplitterSpecs = (specifications: Record<string, any>): string | null => {
  if (!specifications.input_ports || specifications.input_ports < 1) {
    return "Input ports is required";
  }
  if (!specifications.output_ports || specifications.output_ports < 1) {
    return "Output ports is required";
  }
  if (specifications.support_4k === undefined || specifications.support_4k === null) {
    return "4K support selection is required";
  }
  if (specifications.power_adapter_included === undefined || specifications.power_adapter_included === null) {
    return "Power adapter included selection is required";
  }
  return null;
};

const HDMISplitterFields = ({ specifications, onSpecificationChange }: HDMISplitterFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">HDMI Splitter Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Input Ports <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              min="1"
              value={specifications.input_ports || ""}
              onChange={(e) => onSpecificationChange("input_ports", parseInt(e.target.value) || 0)}
              placeholder="e.g., 1"
            />
          </div>

          <div className="space-y-2">
            <Label>Output Ports <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              min="1"
              value={specifications.output_ports || ""}
              onChange={(e) => onSpecificationChange("output_ports", parseInt(e.target.value) || 0)}
              placeholder="e.g., 4"
            />
          </div>

          <div className="space-y-2">
            <Label>4K Support <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.support_4k === true ? "yes" : specifications.support_4k === false ? "no" : ""}
              onValueChange={(value) => onSpecificationChange("support_4k", value === "yes")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select 4K support" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Power Adapter Included <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.power_adapter_included === true ? "yes" : specifications.power_adapter_included === false ? "no" : ""}
              onValueChange={(value) => onSpecificationChange("power_adapter_included", value === "yes")}
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

export default HDMISplitterFields;
