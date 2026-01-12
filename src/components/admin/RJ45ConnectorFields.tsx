import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RJ45ConnectorFieldsProps {
  specifications: Record<string, any>;
  onSpecificationChange: (key: string, value: any) => void;
}

export const validateRJ45ConnectorSpecs = (specifications: Record<string, any>): string | null => {
  if (!specifications.cable_category) {
    return "Cable category is required for RJ45 Connector";
  }
  if (!specifications.connector_type) {
    return "Connector type is required for RJ45 Connector";
  }
  if (!specifications.pack_size || specifications.pack_size < 1) {
    return "Pack size is required and must be at least 1";
  }
  return null;
};

const RJ45ConnectorFields = ({ specifications, onSpecificationChange }: RJ45ConnectorFieldsProps) => {
  const handleQuickFillDefaults = () => {
    let filled = false;

    // Common RJ45 connector defaults
    if (!specifications.cable_category) { onSpecificationChange("cable_category", "Cat6"); filled = true; }
    if (!specifications.connector_type) { onSpecificationChange("connector_type", "Pass Through"); filled = true; }
    if (!specifications.pack_size) { onSpecificationChange("pack_size", 100); filled = true; }
    if (specifications.allow_in_quotation === undefined) { onSpecificationChange("allow_in_quotation", true); filled = true; }

    if (filled) {
      toast({
        title: "Defaults Applied",
        description: "RJ45 connector defaults have been applied.",
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

      {/* Section: Connector Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Connector Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cable Category */}
          <div className="space-y-2">
            <Label htmlFor="cable_category">
              Cable Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={specifications.cable_category || ""}
              onValueChange={(value) => onSpecificationChange("cable_category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cable category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cat5e">Cat5e</SelectItem>
                <SelectItem value="Cat6">Cat6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Connector Type */}
          <div className="space-y-2">
            <Label htmlFor="connector_type">
              Connector Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={specifications.connector_type || ""}
              onValueChange={(value) => onSpecificationChange("connector_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select connector type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pass Through">Pass Through</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
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

export default RJ45ConnectorFields;
