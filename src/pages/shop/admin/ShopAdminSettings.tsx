import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, Store, Truck, CreditCard, Bell, Mail } from 'lucide-react';

interface ShopSettings {
  store_name: string;
  store_tagline: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  currency: string;
  tax_rate: string;
  free_shipping_threshold: string;
  default_shipping_rate: string;
  low_stock_threshold: string;
  enable_cod: string;
  enable_online_payment: string;
  order_notification_email: string;
}

const defaultSettings: ShopSettings = {
  store_name: 'Shoppie STALLION',
  store_tagline: 'Your Electronics Partner',
  store_email: '',
  store_phone: '',
  store_address: '',
  currency: 'INR',
  tax_rate: '18',
  free_shipping_threshold: '5000',
  default_shipping_rate: '150',
  low_stock_threshold: '5',
  enable_cod: 'true',
  enable_online_payment: 'false',
  order_notification_email: ''
};

export default function ShopAdminSettings() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<ShopSettings>(defaultSettings);

  const { data: savedSettings, isLoading } = useQuery({
    queryKey: ['shop-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .like('key', 'shop_%');
      
      if (error) throw error;
      
      const settingsMap: Record<string, string> = {};
      data?.forEach(item => {
        const key = item.key.replace('shop_', '');
        settingsMap[key] = item.value || '';
      });
      return settingsMap;
    }
  });

  useEffect(() => {
    if (savedSettings) {
      setSettings(prev => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(savedSettings).filter(([key]) => key in defaultSettings)
        )
      }));
    }
  }, [savedSettings]);

  const saveMutation = useMutation({
    mutationFn: async (newSettings: ShopSettings) => {
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        key: `shop_${key}`,
        value: value
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(
            { key: update.key, value: update.value },
            { onConflict: 'key' }
          );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save settings');
      console.error(error);
    }
  });

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-shop-navy">Store Settings</h1>
          <p className="text-muted-foreground">Configure your store preferences</p>
        </div>
        <Button 
          onClick={handleSave} 
          className="bg-shop-orange hover:bg-shop-orange-dark"
          disabled={saveMutation.isPending}
        >
          <Save className="mr-2 h-4 w-4" />
          {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Store className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="mr-2 h-4 w-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic details about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input
                    id="store_name"
                    value={settings.store_name}
                    onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="store_tagline">Tagline</Label>
                  <Input
                    id="store_tagline"
                    value={settings.store_tagline}
                    onChange={(e) => setSettings({ ...settings, store_tagline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="store_email">Store Email</Label>
                  <Input
                    id="store_email"
                    type="email"
                    value={settings.store_email}
                    onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="store_phone">Store Phone</Label>
                  <Input
                    id="store_phone"
                    value={settings.store_phone}
                    onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="store_address">Store Address</Label>
                <Textarea
                  id="store_address"
                  value={settings.store_address}
                  onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax & Inventory</CardTitle>
              <CardDescription>Tax rates and stock settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="tax_rate">Default Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    value={settings.tax_rate}
                    onChange={(e) => setSettings({ ...settings, tax_rate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                  <Input
                    id="low_stock_threshold"
                    type="number"
                    value={settings.low_stock_threshold}
                    onChange={(e) => setSettings({ ...settings, low_stock_threshold: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>Configure shipping rates and thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default_shipping_rate">Default Shipping Rate (₹)</Label>
                  <Input
                    id="default_shipping_rate"
                    type="number"
                    value={settings.default_shipping_rate}
                    onChange={(e) => setSettings({ ...settings, default_shipping_rate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (₹)</Label>
                  <Input
                    id="free_shipping_threshold"
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Orders above this amount get free shipping
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Enable or disable payment options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Cash on Delivery (COD)</p>
                  <p className="text-sm text-muted-foreground">Accept payment when order is delivered</p>
                </div>
                <Switch
                  checked={settings.enable_cod === 'true'}
                  onCheckedChange={(checked) => setSettings({ ...settings, enable_cod: String(checked) })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                <div>
                  <p className="font-medium">Online Payment (Razorpay)</p>
                  <p className="text-sm text-muted-foreground">Accept cards, UPI, and net banking</p>
                </div>
                <Switch
                  checked={settings.enable_online_payment === 'true'}
                  onCheckedChange={(checked) => setSettings({ ...settings, enable_online_payment: String(checked) })}
                  disabled
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Online payment integration coming soon. Contact support to enable.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Notifications</CardTitle>
              <CardDescription>Get notified when orders are placed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="order_notification_email">Notification Email</Label>
                <Input
                  id="order_notification_email"
                  type="email"
                  value={settings.order_notification_email}
                  onChange={(e) => setSettings({ ...settings, order_notification_email: e.target.value })}
                  placeholder="admin@example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Receive email notifications for new orders
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
