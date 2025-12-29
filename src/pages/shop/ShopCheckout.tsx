import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { useShopAuth } from '@/hooks/use-shop-auth';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import type { Address } from '@/types/shop';

export default function ShopCheckout() {
  const navigate = useNavigate();
  const { user } = useShopAuth();
  const { items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
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

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [notes, setNotes] = useState('');

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.selling_price || item.product?.mrp || 0;
    return sum + (price * item.quantity);
  }, 0);

  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 5000 ? 0 : 150;
  const totalAmount = subtotal + taxAmount + shippingAmount;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place order');
      navigate('/shop/auth');
      return;
    }

    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.pincode) {
      toast.error('Please fill in all required shipping address fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Generate order number
      const { data: orderNumberData, error: orderNumberError } = await supabase.rpc('generate_order_number');
      
      if (orderNumberError) throw orderNumberError;

      const finalBillingAddress = sameAsShipping ? shippingAddress : billingAddress;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('shop_orders')
        .insert([{
          user_id: user.id,
          order_number: orderNumberData,
          status: 'pending',
          payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
          payment_method: paymentMethod,
          subtotal: subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingAmount,
          discount_amount: 0,
          total_amount: totalAmount,
          shipping_address: JSON.parse(JSON.stringify(shippingAddress)),
          billing_address: JSON.parse(JSON.stringify(finalBillingAddress)),
          notes: notes || null
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name || 'Unknown Product',
        product_sku: item.product?.sku || null,
        quantity: item.quantity,
        unit_price: item.product?.selling_price || item.product?.mrp || 0,
        tax_rate: item.product?.tax_rate || 18,
        tax_amount: ((item.product?.selling_price || item.product?.mrp || 0) * item.quantity) * 0.18,
        total_price: (item.product?.selling_price || item.product?.mrp || 0) * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('shop_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      toast.success(`Order ${orderNumberData} placed successfully!`);
      navigate(`/shop/order-success?order=${orderNumberData}`);

    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login to Checkout</h1>
          <Button onClick={() => navigate('/shop/auth')} className="bg-shop-orange hover:bg-shop-orange-dark">
            Login / Sign Up
          </Button>
        </div>
      </ShopLayout>
    );
  }

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <Button onClick={() => navigate('/shop/products')} variant="outline">
            Continue Shopping
          </Button>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/shop/cart')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <h1 className="text-3xl font-bold text-shop-navy mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-shop-orange" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ship-name">Full Name *</Label>
                  <Input
                    id="ship-name"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="ship-phone">Phone Number *</Label>
                  <Input
                    id="ship-phone"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="ship-line1">Address Line 1 *</Label>
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
                  <Label htmlFor="ship-city">City *</Label>
                  <Input
                    id="ship-city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="ship-state">State</Label>
                  <Input
                    id="ship-state"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="ship-pincode">Pincode *</Label>
                  <Input
                    id="ship-pincode"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    placeholder="Pincode"
                  />
                </div>
                <div>
                  <Label htmlFor="ship-country">Country</Label>
                  <Input
                    id="ship-country"
                    value={shippingAddress.country}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Billing Address</span>
                  <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="rounded"
                    />
                    Same as shipping
                  </label>
                </CardTitle>
              </CardHeader>
              {!sameAsShipping && (
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bill-name">Full Name *</Label>
                    <Input
                      id="bill-name"
                      value={billingAddress.name}
                      onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bill-phone">Phone Number *</Label>
                    <Input
                      id="bill-phone"
                      value={billingAddress.phone}
                      onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bill-line1">Address Line 1 *</Label>
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
                    <Label htmlFor="bill-city">City *</Label>
                    <Input
                      id="bill-city"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bill-state">State</Label>
                    <Input
                      id="bill-state"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bill-pincode">Pincode *</Label>
                    <Input
                      id="bill-pincode"
                      value={billingAddress.pincode}
                      onChange={(e) => setBillingAddress({ ...billingAddress, pincode: e.target.value })}
                      placeholder="Pincode"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bill-country">Country</Label>
                    <Input
                      id="bill-country"
                      value={billingAddress.country}
                      disabled
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-shop-orange" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                    <RadioGroupItem value="razorpay" id="razorpay" disabled />
                    <Label htmlFor="razorpay" className="flex-1">
                      <div className="font-medium">Pay Online (Coming Soon)</div>
                      <div className="text-sm text-muted-foreground">Credit/Debit Card, UPI, Net Banking</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for your order..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span>₹{((item.product?.selling_price || item.product?.mrp || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingAmount === 0 ? 'Free' : `₹${shippingAmount}`}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-shop-orange">₹{totalAmount.toLocaleString()}</span>
                </div>

                <Button 
                  className="w-full bg-shop-orange hover:bg-shop-orange-dark text-white"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secure Checkout</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
