import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface LANToUSBConverterFieldsProps {
  specifications: Record<string, any>;
  onSpecificationChange: (key: string, value: any) => void;
}

export const validateLANToUSBConverterSpecs = (specifications: Record<string, any>): string | null => {
  if (!specifications.supported_device) {
    return "Supported device is required";
  }
  if (specifications.driver_required === undefined || specifications.driver_required === null) {
    return "Driver required selection is required";
  }
  return null;
};

const LANToUSBConverterFields = ({ specifications, onSpecificationChange }: LANToUSBConverterFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">LAN to USB Converter Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Supported Device <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.supported_device || ""}
              onValueChange={(value) => onSpecificationChange("supported_device", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Printer">Printer</SelectItem>
                <SelectItem value="USB Device">USB Device</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Driver Required <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.driver_required === true ? "yes" : specifications.driver_required === false ? "no" : ""}
              onValueChange={(value) => onSpecificationChange("driver_required", value === "yes")}
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

export default LANToUSBConverterFields;
