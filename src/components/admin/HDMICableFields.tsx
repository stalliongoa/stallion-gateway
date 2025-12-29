import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface HDMICableFieldsProps {
  specifications: Record<string, any>;
  onSpecificationChange: (key: string, value: any) => void;
}

export const validateHDMICableSpecs = (specifications: Record<string, any>): string | null => {
  if (!specifications.hdmi_version) {
    return "HDMI version is required";
  }
  if (!specifications.cable_length) {
    return "Cable length is required";
  }
  if (specifications.support_4k === undefined || specifications.support_4k === null) {
    return "4K support selection is required";
  }
  return null;
};

const HDMICableFields = ({ specifications, onSpecificationChange }: HDMICableFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">HDMI Cable Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Version <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.hdmi_version || ""}
              onValueChange={(value) => onSpecificationChange("hdmi_version", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HDMI 1.4">HDMI 1.4</SelectItem>
                <SelectItem value="HDMI 2.0">HDMI 2.0</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Length <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.cable_length || ""}
              onValueChange={(value) => onSpecificationChange("cable_length", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1m</SelectItem>
                <SelectItem value="3m">3m</SelectItem>
                <SelectItem value="5m">5m</SelectItem>
                <SelectItem value="10m">10m</SelectItem>
              </SelectContent>
            </Select>
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

export default HDMICableFields;
