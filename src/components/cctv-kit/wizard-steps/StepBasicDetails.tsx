import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Info } from 'lucide-react';
import type { KitWizardData, KitType, ChannelCapacity, CameraResolution } from '@/types/cctv-kit';

interface StepBasicDetailsProps {
  data: KitWizardData;
  onChange: (updates: Partial<KitWizardData>) => void;
}

export function StepBasicDetails({ data, onChange }: StepBasicDetailsProps) {
  const { data: brands } = useQuery({
    queryKey: ['shop-brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_brands')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kit Basic Details</CardTitle>
        <CardDescription>
          Define the core attributes of your CCTV kit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Kit Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Kit Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., 2MP 4CH CCTV KIT – CP PLUS"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Use a descriptive name including resolution, channels, and brand
          </p>
        </div>
        
        {/* Kit Type */}
        <div className="space-y-2">
          <Label>
            Kit Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.kit_type}
            onValueChange={(value: KitType) => onChange({ kit_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select kit type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analog">Analog CCTV Kit</SelectItem>
              <SelectItem value="ip" disabled>IP CCTV Kit (Coming Soon)</SelectItem>
              <SelectItem value="wifi" disabled>WiFi CCTV Kit (Coming Soon)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Channel Capacity */}
        <div className="space-y-2">
          <Label>
            Channel Capacity <span className="text-destructive">*</span>
          </Label>
          <Select
            value={String(data.channel_capacity)}
            onValueChange={(value) => onChange({ channel_capacity: Number(value) as ChannelCapacity })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select channel capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 Channel</SelectItem>
              <SelectItem value="8">8 Channel</SelectItem>
              <SelectItem value="16">16 Channel</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg mt-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Channel capacity determines default quantities for cameras, cables, and storage recommendations
            </p>
          </div>
        </div>
        
        {/* Camera Resolution */}
        <div className="space-y-2">
          <Label>Camera Resolution</Label>
          <Select
            value={data.camera_resolution}
            onValueChange={(value: CameraResolution) => onChange({ camera_resolution: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2MP">2 Megapixel (1080p)</SelectItem>
              <SelectItem value="4MP">4 Megapixel (2K)</SelectItem>
              <SelectItem value="5MP">5 Megapixel (Super HD)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Brand */}
        <div className="space-y-2">
          <Label>
            Brand <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.brand_id || ''}
            onValueChange={(value) => onChange({ brand_id: value || null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Status Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label>Kit Status</Label>
            <p className="text-sm text-muted-foreground">
              {data.status === 'active' ? 'Kit is visible to customers' : 'Kit is hidden from customers'}
            </p>
          </div>
          <Switch
            checked={data.status === 'active'}
            onCheckedChange={(checked) => onChange({ status: checked ? 'active' : 'inactive' })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
