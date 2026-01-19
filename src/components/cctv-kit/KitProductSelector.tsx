import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, Check, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductType, KitItemSelection } from '@/types/cctv-kit';

interface KitProductSelectorProps {
  productType: ProductType;
  filters?: Record<string, any>;
  selectedItems: KitItemSelection[];
  onSelectProduct: (product: any) => void;
  allowMultiple?: boolean;
  title: string;
}

export function KitProductSelector({
  productType,
  filters = {},
  selectedItems,
  onSelectProduct,
  allowMultiple = false,
  title,
}: KitProductSelectorProps) {
  const [search, setSearch] = useState('');
  
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
        <ScrollArea className="h-[400px] px-4 pb-4">
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
                const isSelected = selectedProductIds.includes(product.id);
                
                return (
                  <div
                    key={product.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                    onClick={() => onSelectProduct(product)}
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
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium truncate">
                            {product.name}
                          </p>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </div>
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
