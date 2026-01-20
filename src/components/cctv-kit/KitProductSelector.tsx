import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, Minus, Package, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductType, KitItemSelection } from '@/types/cctv-kit';

interface KitProductSelectorProps {
  productType: ProductType;
  filters?: Record<string, any>;
  selectedItems: KitItemSelection[];
  onAddProduct: (product: any, quantity: number) => void;
  allowMultiple?: boolean;
  title: string;
  unitType?: 'pieces' | 'meters';
  defaultQuantity?: number;
}

export function KitProductSelector({
  productType,
  filters = {},
  selectedItems,
  onAddProduct,
  allowMultiple = false,
  title,
  unitType = 'pieces',
  defaultQuantity = 0,
}: KitProductSelectorProps) {
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['kit-products', productType, filters],
    queryFn: async () => {
      let query = supabase
        .from('shop_products')
        .select(`
          *,
          brand:shop_brands(id, name),
          category:shop_categories(id, name, slug)
        `)
        .eq('is_active', true)
        .is('deleted_at', null);
      
      // Map product type to specification product_type values in the database
      const productTypeMap: Record<ProductType, string[]> = {
        camera: ['cctv_camera', 'analog_camera', 'ip_camera'],
        dvr: ['dvr'],
        nvr: ['nvr'],
        smps: ['smps'],
        hard_drive: ['hdd', 'hard_drive'],
        cable: ['cable', 'cables'],
        monitor: ['monitor'],
        ups: ['ups'],
        rack: ['rack'],
        accessory: ['accessories', 'bnc_connector', 'dc_pin', 'rj45_connector', 'video_balun'],
        wifi_camera: ['wifi_camera'],
      };
      
      // Apply brand filter if provided
      if (filters.brand_id) {
        query = query.eq('brand_id', filters.brand_id);
      }
      
      // Apply additional specifications filter
      if (filters.specifications) {
        Object.entries(filters.specifications).forEach(([key, value]) => {
          if (value) {
            query = query.contains('specifications', { [key]: value });
          }
        });
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      
      // Filter by product_type in specifications
      const validProductTypes = productTypeMap[productType] || [];
      return data.filter(product => {
        if (validProductTypes.length === 0) return true;
        const specs = product.specifications as Record<string, any> | null;
        const specProductType = specs?.product_type;
        if (!specProductType) return false;
        return validProductTypes.some(pt => 
          String(specProductType).toLowerCase() === pt.toLowerCase()
        );
      });
    },
  });
  
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku?.toLowerCase().includes(search.toLowerCase())
  ) || [];
  
  const selectedProductIds = selectedItems
    .filter(item => item.product_type === productType)
    .map(item => item.product_id);
  
  const getQuantity = (productId: string) => quantities[productId] ?? defaultQuantity;
  
  const updateQuantity = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] ?? defaultQuantity) + delta),
    }));
  };
  
  const handleAddToKit = (product: any) => {
    const qty = getQuantity(product.id);
    onAddProduct(product, qty);
    // Reset quantity after adding
    setQuantities(prev => {
      const newState = { ...prev };
      delete newState[product.id];
      return newState;
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="h-4 w-4" />
          {title}
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px] px-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No products found</p>
              <p className="text-xs">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => {
                const isAlreadyAdded = selectedProductIds.includes(product.id);
                const qty = getQuantity(product.id);
                
                return (
                  <div
                    key={product.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      isAlreadyAdded 
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {product.name}
                        </p>
                        {product.sku && (
                          <p className="text-xs text-muted-foreground">
                            SKU: {product.sku}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {product.brand && (
                            <Badge variant="outline" className="text-xs">
                              {product.brand.name}
                            </Badge>
                          )}
                          <span className="text-sm font-medium text-primary">
                            ₹{(product.purchase_price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity and Add Button Row */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground mr-1">
                          Qty{unitType === 'meters' ? ' (m)' : ''}:
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(product.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={qty}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setQuantities(prev => ({ ...prev, [product.id]: Math.max(0, value) }));
                          }}
                          className="h-7 w-14 text-center text-xs px-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(product.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => handleAddToKit(product)}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Add to Kit
                      </Button>
                    </div>
                    
                    {isAlreadyAdded && (
                      <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Already in kit
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}