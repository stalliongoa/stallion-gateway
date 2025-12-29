import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopAuth } from '@/hooks/use-shop-auth';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, MapPin, Package, LogOut, Loader2, Save } from 'lucide-react';
import type { Address } from '@/types/shop';

interface CustomerProfile {
  id: string;
  company_name: string | null;
  gst_number: string | null;
  phone: string | null;
  billing_address: Address | null;
  shipping_address: Address | null;
}

export default function ShopAccount() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, signOut } = useShopAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [userProfile, setUserProfile] = useState<{ full_name: string | null }>({ full_name: null });
  
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Goa',
    pincode: '',
    country: 'India'
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Goa',
    pincode: '',
    country: 'India'
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/shop/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .maybeSingle();

      if (profileData) {
        setUserProfile(profileData);
      }

      // Fetch customer profile
      const { data: customerData } = await supabase
        .from('shop_customers')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (customerData) {
        setProfile(customerData as unknown as CustomerProfile);
        if (customerData.shipping_address) {
          setShippingAddress(customerData.shipping_address as unknown as Address);
        }
        if (customerData.billing_address) {
          setBillingAddress(customerData.billing_address as unknown as Address);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      // Update or create customer profile
      const { error } = await supabase
        .from('shop_customers')
        .upsert({
          user_id: user.id,
          phone: profile?.phone || null,
          company_name: profile?.company_name || null,
          gst_number: profile?.gst_number || null,
          shipping_address: JSON.parse(JSON.stringify(shippingAddress)),
          billing_address: JSON.parse(JSON.stringify(billingAddress))
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('Profile saved successfully');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/shop');
  };

  if (authLoading || isLoading) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-shop-orange" />
        </div>
      </ShopLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-shop-navy">My Account</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="mr-2 h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="orders" onClick={() => navigate('/shop/orders')}>
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userProfile.full_name || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Name from your account</p>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile?.phone || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : { id: '', company_name: null, gst_number: null, phone: e.target.value, billing_address: null, shipping_address: null })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name (Optional)</Label>
                    <Input
                      id="company"
                      value={profile?.company_name || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, company_name: e.target.value } : { id: '', company_name: e.target.value, gst_number: null, phone: null, billing_address: null, shipping_address: null })}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="gst">GST Number (Optional)</Label>
                    <Input
                      id="gst"
                      value={profile?.gst_number || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, gst_number: e.target.value } : { id: '', company_name: null, gst_number: e.target.value, phone: null, billing_address: null, shipping_address: null })}
                      placeholder="Enter GST number for business purchases"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-shop-orange hover:bg-shop-orange-dark">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Default address for deliveries</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ship-name">Full Name</Label>
                  <Input
                    id="ship-name"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    placeholder="Recipient name"
                  />
                </div>
                <div>
                  <Label htmlFor="ship-phone">Phone</Label>
                  <Input
                    id="ship-phone"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    placeholder="Contact number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="ship-line1">Address Line 1</Label>
                  <Input
                    id="ship-line1"
                    value={shippingAddress.line1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                    placeholder="House/Flat No., Building Name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="ship-line2">Address Line 2</Label>
                  <Input
                    id="ship-line2"
                    value={shippingAddress.line2 || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                    placeholder="Street, Area, Landmark"
                  />
                </div>
                <div>
                  <Label htmlFor="ship-city">City</Label>
                  <Input
                    id="ship-city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ship-state">State</Label>
                  <Input
                    id="ship-state"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ship-pincode">Pincode</Label>
                  <Input
                    id="ship-pincode"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ship-country">Country</Label>
                  <Input id="ship-country" value={shippingAddress.country} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>Address for invoices</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bill-name">Full Name</Label>
                  <Input
                    id="bill-name"
                    value={billingAddress.name}
                    onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
                    placeholder="Name on invoice"
                  />
                </div>
                <div>
                  <Label htmlFor="bill-phone">Phone</Label>
                  <Input
                    id="bill-phone"
                    value={billingAddress.phone}
                    onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                    placeholder="Contact number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bill-line1">Address Line 1</Label>
                  <Input
                    id="bill-line1"
                    value={billingAddress.line1}
                    onChange={(e) => setBillingAddress({ ...billingAddress, line1: e.target.value })}
                    placeholder="House/Flat No., Building Name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bill-line2">Address Line 2</Label>
                  <Input
                    id="bill-line2"
                    value={billingAddress.line2 || ''}
                    onChange={(e) => setBillingAddress({ ...billingAddress, line2: e.target.value })}
                    placeholder="Street, Area, Landmark"
                  />
                </div>
                <div>
                  <Label htmlFor="bill-city">City</Label>
                  <Input
                    id="bill-city"
                    value={billingAddress.city}
                    onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bill-state">State</Label>
                  <Input
                    id="bill-state"
                    value={billingAddress.state}
                    onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bill-pincode">Pincode</Label>
                  <Input
                    id="bill-pincode"
                    value={billingAddress.pincode}
                    onChange={(e) => setBillingAddress({ ...billingAddress, pincode: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bill-country">Country</Label>
                  <Input id="bill-country" value={billingAddress.country} disabled />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-shop-orange hover:bg-shop-orange-dark">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Addresses
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </ShopLayout>
  );
}
