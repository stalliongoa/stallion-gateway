import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useShopAuth } from './use-shop-auth';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    selling_price: number;
    mrp: number;
    images: string[];
    stock_quantity: number;
    sku?: string | null;
    tax_rate?: number | null;
  };
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  itemCount: number;
  subtotal: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useShopAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('shop_cart')
      .select(`
        id,
        product_id,
        quantity,
        product:shop_products (
          id,
          name,
          slug,
          selling_price,
          mrp,
          images,
          stock_quantity,
          sku,
          tax_rate
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error);
    } else {
      setItems((data as unknown as CartItem[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive"
      });
      return;
    }

    const existingItem = items.find(item => item.product_id === productId);

    if (existingItem) {
      await updateQuantity(productId, existingItem.quantity + quantity);
    } else {
      const { error } = await supabase
        .from('shop_cart')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Added to Cart",
          description: "Item has been added to your cart"
        });
        await fetchCart();
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    const { error } = await supabase
      .from('shop_cart')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    } else {
      await fetchCart();
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('shop_cart')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Removed",
        description: "Item removed from cart"
      });
      await fetchCart();
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('shop_cart')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
    } else {
      setItems([]);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    return sum + (Number(item.product?.selling_price || 0) * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      itemCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refetch: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
