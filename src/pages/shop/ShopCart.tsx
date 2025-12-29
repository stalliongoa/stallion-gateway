import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useShopAuth } from '@/hooks/use-shop-auth';

export default function ShopCart() {
  const { user } = useShopAuth();
  const { items, isLoading, subtotal, updateQuantity, removeFromCart } = useCart();

  if (!user) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-muted-foreground mb-6">Login to view your cart and place orders</p>
          <Link to="/shop/auth"><Button>Login</Button></Link>
        </div>
      </ShopLayout>
    );
  }

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Link to="/shop/products"><Button>Browse Products</Button></Link>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart ({items.length} items)</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg border">
                <img src={item.product?.images?.[0] || '/placeholder.svg'} alt="" className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <Link to={`/shop/product/${item.product?.slug}`} className="font-medium hover:text-stallion-gold">
                    {item.product?.name}
                  </Link>
                  <p className="text-lg font-bold mt-2">₹{Number(item.product?.selling_price || 0).toLocaleString('en-IN')}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border rounded">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product_id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product_id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeFromCart(item.product_id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-lg border p-6 h-fit">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            </div>
            <Link to="/shop/checkout"><Button className="w-full bg-stallion-gold text-stallion-navy" size="lg">Proceed to Checkout</Button></Link>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
