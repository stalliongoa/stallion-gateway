import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VideoBalunFieldsProps {
  specifications: Record<string, any>;
  onSpecificationChange: (key: string, value: any) => void;
}

export const validateVideoBalunSpecs = (specifications: Record<string, any>): string | null => {
  if (!specifications.balun_type) {
    return "Type is required for Video Balun";
  }
  if (!specifications.distance_supported) {
    return "Distance supported is required for Video Balun";
  }
  if (!specifications.compatible_cable) {
    return "Compatible cable is required for Video Balun";
  }
  return null;
};

const VideoBalunFields = ({ specifications, onSpecificationChange }: VideoBalunFieldsProps) => {
  const handleQuickFillDefaults = () => {
    let filled = false;

    // Common Video Balun defaults - Passive type is most common for CCTV
    if (!specifications.balun_type) { onSpecificationChange("balun_type", "Passive"); filled = true; }
    if (!specifications.distance_supported) { onSpecificationChange("distance_supported", "300m"); filled = true; }
    if (!specifications.compatible_cable) { onSpecificationChange("compatible_cable", "Cat5e"); filled = true; }
    if (specifications.allow_in_quotation === undefined) { onSpecificationChange("allow_in_quotation", true); filled = true; }

    if (filled) {
      toast({
        title: "Defaults Applied",
        description: "Video Balun defaults have been applied.",
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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Video Balun Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.balun_type || ""}
              onValueChange={(value) => onSpecificationChange("balun_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Passive">Passive</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Distance Supported <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.distance_supported || ""}
              onValueChange={(value) => onSpecificationChange("distance_supported", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100m">100m</SelectItem>
                <SelectItem value="300m">300m</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Compatible Cable <span className="text-destructive">*</span></Label>
            <Select
              value={specifications.compatible_cable || ""}
              onValueChange={(value) => onSpecificationChange("compatible_cable", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cable type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cat5e">Cat5e</SelectItem>
                <SelectItem value="Cat6">Cat6</SelectItem>
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

export default VideoBalunFields;
