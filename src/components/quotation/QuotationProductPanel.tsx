import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CategoryType, CCTVSystemType, SpecDefinition, QuotationItem } from '@/types/quotation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Filter, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  selling_price: number | null;
  mrp: number | null;
  specifications: Record<string, string | boolean | number>;
  images: string[] | null;
  brand?: { name: string } | null;
  stock_quantity: number | null;
}

interface QuotationProductPanelProps {
  categoryType: CategoryType;
  systemType: CCTVSystemType | null;
  specDefinitions: SpecDefinition[];
  onAddItem: (item: QuotationItem) => void;
}

export function QuotationProductPanel({
  categoryType,
  systemType,
  specDefinitions,
  onAddItem,
}: QuotationProductPanelProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string | boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, [categoryType, systemType, filters]);

  const fetchBrands = async () => {
    const { data } = await supabase
      .from('shop_brands')
      .select('id, name')
      .eq('is_active', true);
    if (data) setBrands(data);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('shop_products')
        .select('id, name, sku, selling_price, mrp, specifications, images, stock_quantity, brand:shop_brands(name)')
        .eq('is_active', true);

      // Filter by category type in specifications
      if (systemType) {
        query = query.contains('specifications', { cctv_system_type: systemType });
      }

      // Apply spec filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== 'all') {
          if (typeof value === 'boolean') {
            query = query.contains('specifications', { [key]: value });
          } else {
            query = query.contains('specifications', { [key]: value });
          }
        }
      });

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setProducts(data as unknown as Product[] || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddProduct = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    const unitPrice = product.selling_price || product.mrp || 0;
    
    onAddItem({
      product_id: product.id,
      product_name: product.name,
      product_sku: product.sku,
      category_type: categoryType,
      specifications: product.specifications || {},
      quantity,
      unit_price: unitPrice,
      total_price: unitPrice * quantity,
    });

    // Reset quantity
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const filterableSpecs = specDefinitions.filter(s => s.is_filterable);

  return (
    <Card className="h-fit">
      <CardHeader className="py-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="h-4 w-4" />
          Available Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filters
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Brand Filter */}
            <div className="space-y-1">
              <Label className="text-xs">Brand</Label>
              <Select
                value={(filters['brand'] as string) || 'all'}
                onValueChange={(v) => handleFilterChange('brand', v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Spec Filters */}
            {filterableSpecs.slice(0, 5).map((spec) => (
              <div key={spec.spec_key} className="space-y-1">
                <Label className="text-xs">{spec.spec_label}</Label>
                {spec.field_type === 'select' && spec.options ? (
                  <Select
                    value={(filters[spec.spec_key] as string) || 'all'}
                    onValueChange={(v) => handleFilterChange(spec.spec_key, v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder={`All ${spec.spec_label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {spec.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : spec.field_type === 'checkbox' ? (
                  <div className="flex items-center space-x-2 h-8">
                    <Checkbox
                      id={spec.spec_key}
                      checked={filters[spec.spec_key] as boolean || false}
                      onCheckedChange={(checked) => handleFilterChange(spec.spec_key, !!checked)}
                    />
                    <Label htmlFor={spec.spec_key} className="text-xs">Yes</Label>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-2 max-h-[400px] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No products found matching your criteria</p>
              <p className="text-xs">Try adjusting your filters</p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="p-3 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {product.brand?.name && (
                        <Badge variant="secondary" className="text-xs">
                          {product.brand.name}
                        </Badge>
                      )}
                      {product.sku && (
                        <span className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-semibold text-primary">
                        ₹{(product.selling_price || product.mrp || 0).toLocaleString()}
                      </span>
                      {product.mrp && product.selling_price && product.mrp > product.selling_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{product.mrp.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={1}
                        value={quantities[product.id] || 1}
                        onChange={(e) => setQuantities(prev => ({
                          ...prev,
                          [product.id]: parseInt(e.target.value) || 1
                        }))}
                        className="w-16 h-8 text-center text-sm"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddProduct(product)}
                      className="h-8 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
