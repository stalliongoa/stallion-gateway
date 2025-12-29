import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useShopAuth } from '@/hooks/use-shop-auth';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Package, ChevronRight, Loader2, ArrowLeft, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { Order, OrderItem, Address } from '@/types/shop';

export default function ShopOrders() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { user, isLoading: authLoading } = useShopAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/shop/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
        fetchOrderItems(orderId);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [orderId, orders]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedOrders: Order[] = (data || []).map(order => ({
        ...order,
        status: order.status as Order['status'],
        payment_status: order.payment_status as Order['payment_status'],
        shipping_address: order.shipping_address as unknown as Address | null,
        billing_address: order.billing_address as unknown as Address | null,
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('shop_order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      setOrderItems(data as OrderItem[] || []);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  // Order Detail View
  if (selectedOrder) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/shop/orders')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedOrder.order_number}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {format(new Date(selectedOrder.created_at), 'MMMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                      <Badge className={getPaymentStatusColor(selectedOrder.payment_status)}>
                        {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.product_sku || 'N/A'} | Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{Number(item.total_price).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">₹{Number(item.unit_price).toLocaleString()} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedOrder.shipping_address ? (
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{selectedOrder.shipping_address.name}</p>
                        <p>{selectedOrder.shipping_address.line1}</p>
                        {selectedOrder.shipping_address.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
                        <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pincode}</p>
                        <p className="flex items-center gap-1 mt-2">
                          <Phone className="h-3 w-3" />
                          {selectedOrder.shipping_address.phone}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No address provided</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Billing Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedOrder.billing_address ? (
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{selectedOrder.billing_address.name}</p>
                        <p>{selectedOrder.billing_address.line1}</p>
                        {selectedOrder.billing_address.line2 && <p>{selectedOrder.billing_address.line2}</p>}
                        <p>{selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.pincode}</p>
                        <p className="flex items-center gap-1 mt-2">
                          <Phone className="h-3 w-3" />
                          {selectedOrder.billing_address.phone}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Same as shipping</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{Number(selectedOrder.subtotal).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{Number(selectedOrder.tax_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{Number(selectedOrder.shipping_amount || 0) === 0 ? 'Free' : `₹${Number(selectedOrder.shipping_amount || 0)}`}</span>
                    </div>
                    {Number(selectedOrder.discount_amount || 0) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{Number(selectedOrder.discount_amount).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-shop-orange">₹{Number(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>

                  <div className="pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="capitalize">{selectedOrder.payment_method || 'N/A'}</span>
                    </div>
                    {selectedOrder.shipped_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipped</span>
                        <span>{format(new Date(selectedOrder.shipped_at), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    {selectedOrder.delivered_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivered</span>
                        <span>{format(new Date(selectedOrder.delivered_at), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ShopLayout>
    );
  }

  // Orders List View
  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-shop-navy">My Orders</h1>
          <Link to="/shop/account">
            <Button variant="outline">
              <UserIcon className="mr-2 h-4 w-4" />
              My Account
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
              <Button onClick={() => navigate('/shop/products')} className="bg-shop-orange hover:bg-shop-orange-dark">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card 
                key={order.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/shop/orders/${order.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg">{order.order_number}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.payment_status)}>
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {format(new Date(order.created_at), 'MMM dd, yyyy h:mm a')}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-xl font-bold text-shop-orange">₹{Number(order.total_amount).toLocaleString()}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
