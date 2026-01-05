import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, X, Package, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KitProductSelector } from '../KitProductSelector';
import type { KitWizardData, ProductType, KitItemSelection, ChannelCapacity } from '@/types/cctv-kit';
import { CHANNEL_DEFAULTS } from '@/types/cctv-kit';

interface StepProductSelectionProps {
  data: KitWizardData;
  onChange: (updates: Partial<KitWizardData>) => void;
  productType: ProductType;
  title: string;
  description: string;
  showQuantityControls?: boolean;
  unitType?: 'pieces' | 'meters';
  defaultQuantity?: number;
  filters?: Record<string, any>;
  allowMultiple?: boolean;
  suggestion?: string;
}

export function StepProductSelection({
  data,
  onChange,
  productType,
  title,
  description,
  showQuantityControls = true,
  unitType = 'pieces',
  defaultQuantity,
  filters = {},
  allowMultiple = false,
  suggestion,
}: StepProductSelectionProps) {
  const selectedItems = data.items.filter(item => item.product_type === productType);
  
  // Get default quantity based on channel capacity
  const getDefaultQuantity = () => {
    if (defaultQuantity !== undefined) return defaultQuantity;
    
    const channelDefaults = CHANNEL_DEFAULTS[data.channel_capacity as ChannelCapacity];
    
    switch (productType) {
      case 'camera':
        return channelDefaults?.cameras || data.channel_capacity;
      case 'cable':
        return channelDefaults?.cableMeters || 90;
      default:
        return 1;
    }
  };
  
  const handleSelectProduct = (product: any) => {
    const existingIndex = data.items.findIndex(
      item => item.product_type === productType && item.product_id === product.id
    );
    
    if (existingIndex >= 0) {
      // Remove if already selected
      const newItems = [...data.items];
      newItems.splice(existingIndex, 1);
      onChange({ items: newItems });
    } else {
      const newItem: KitItemSelection = {
        product_type: productType,
        product_id: product.id,
        product_name: product.name,
        quantity: getDefaultQuantity(),
        unit_type: unitType,
        purchase_price: product.purchase_price || 0,
        selling_price: product.selling_price || 0,
        is_free_item: false,
      };
      
      if (allowMultiple) {
        onChange({ items: [...data.items, newItem] });
      } else {
        // Replace existing item of same type
        const filteredItems = data.items.filter(item => item.product_type !== productType);
        onChange({ items: [...filteredItems, newItem] });
      }
    }
  };
  
  const updateItemQuantity = (productId: string | null, delta: number) => {
    const newItems = data.items.map(item => {
      if (item.product_type === productType && item.product_id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    onChange({ items: newItems });
  };
  
  const updateItemPrice = (productId: string | null, price: number) => {
    const newItems = data.items.map(item => {
      if (item.product_type === productType && item.product_id === productId) {
        return { ...item, purchase_price: price };
      }
      return item;
    });
    onChange({ items: newItems });
  };
  
  const removeItem = (productId: string | null) => {
    const newItems = data.items.filter(
      item => !(item.product_type === productType && item.product_id === productId)
    );
    onChange({ items: newItems });
  };
  
  // Apply brand filter for camera and DVR
  const appliedFilters = { ...filters };
  if (['camera', 'dvr'].includes(productType) && data.brand_id) {
    appliedFilters.brand_id = data.brand_id;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Selected Items */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestion && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-400">{suggestion}</p>
            </div>
          )}
          
          {selectedItems.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Select a product from the right panel
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div
                  key={item.product_id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <Badge variant="outline" className="mt-1">
                        {item.product_type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product_id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Quantity */}
                    {showQuantityControls && (
                      <div className="space-y-1">
                        <Label className="text-xs">
                          Quantity {unitType === 'meters' && '(meters)'}
                        </Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateItemQuantity(item.product_id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              const delta = value - item.quantity;
                              updateItemQuantity(item.product_id, delta);
                            }}
                            className="h-8 w-20 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateItemQuantity(item.product_id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Purchase Price */}
                    <div className="space-y-1">
                      <Label className="text-xs">Purchase Price (₹)</Label>
                      <Input
                        type="number"
                        value={item.purchase_price}
                        onChange={(e) => updateItemPrice(item.product_id, parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="flex justify-end pt-2 border-t">
                    <span className="text-sm">
                      Total: <span className="font-bold text-primary">
                        ₹{(item.purchase_price * item.quantity).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Right: Product Selector */}
      <KitProductSelector
        productType={productType}
        filters={appliedFilters}
        selectedItems={data.items}
        onSelectProduct={handleSelectProduct}
        allowMultiple={allowMultiple}
        title="Available Products"
      />
    </div>
  );
}
