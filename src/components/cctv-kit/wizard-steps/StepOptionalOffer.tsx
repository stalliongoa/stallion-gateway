import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Sparkles } from 'lucide-react';
import type { KitWizardData, KitItemSelection } from '@/types/cctv-kit';

interface StepOptionalOfferProps {
  data: KitWizardData;
  onChange: (updates: Partial<KitWizardData>) => void;
}

export function StepOptionalOffer({ data, onChange }: StepOptionalOfferProps) {
  const { data: wifiCameras } = useQuery({
    queryKey: ['wifi-cameras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_products')
        .select(`
          *,
          category:shop_categories(id, name, slug)
        `)
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('name');
      
      if (error) throw error;
      
      // Filter for WiFi cameras
      return data.filter(product => 
        product.category?.slug?.toLowerCase().includes('wifi') ||
        product.name.toLowerCase().includes('wifi')
      );
    },
  });
  
  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({ has_free_wifi_camera: true });
    } else {
      // Remove the free wifi camera from items
      const filteredItems = data.items.filter(
        item => !(item.product_type === 'wifi_camera' && item.is_free_item)
      );
      onChange({
        has_free_wifi_camera: false,
        free_wifi_camera_product_id: null,
        items: filteredItems,
      });
    }
  };
  
  const handleSelectCamera = (productId: string) => {
    const camera = wifiCameras?.find(c => c.id === productId);
    if (!camera) return;
    
    // Remove existing free wifi camera from items
    const filteredItems = data.items.filter(
      item => !(item.product_type === 'wifi_camera' && item.is_free_item)
    );
    
    const newItem: KitItemSelection = {
      product_type: 'wifi_camera',
      product_id: camera.id,
      product_name: camera.name,
      quantity: 1,
      unit_type: 'pieces',
      purchase_price: camera.purchase_price || 0,
      selling_price: 0, // Free
      is_free_item: true,
    };
    
    onChange({
      free_wifi_camera_product_id: productId,
      items: [...filteredItems, newItem],
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-green-500" />
          Optional Promotional Offer
        </CardTitle>
        <CardDescription>
          Add a free WiFi camera to make your kit more attractive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggle */}
        <div className="flex items-center justify-between p-4 border-2 border-dashed rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <Label className="text-base font-medium">Add Free WiFi Camera</Label>
              <p className="text-sm text-muted-foreground">
                Include a complimentary WiFi camera with this kit
              </p>
            </div>
          </div>
          <Switch
            checked={data.has_free_wifi_camera}
            onCheckedChange={handleToggle}
          />
        </div>
        
        {/* Camera Selection */}
        {data.has_free_wifi_camera && (
          <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="space-y-2">
              <Label>Select WiFi Camera</Label>
              <Select
                value={data.free_wifi_camera_product_id || ''}
                onValueChange={handleSelectCamera}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a WiFi camera..." />
                </SelectTrigger>
                <SelectContent>
                  {wifiCameras?.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      <div className="flex items-center justify-between gap-4">
                        <span>{camera.name}</span>
                        <span className="text-muted-foreground">
                          Cost: ₹{(camera.purchase_price || 0).toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {data.free_wifi_camera_product_id && (
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                <Gift className="h-4 w-4" />
                <span>
                  This camera will be marked as FREE (₹0) and displayed as a promotional item
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
