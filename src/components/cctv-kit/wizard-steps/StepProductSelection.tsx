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
    <div className="space-y-4">
      {/* Row 1: Header with suggestion */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          {suggestion && (
            <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg mt-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-400">{suggestion}</p>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Row 2: Selected Items with Quantity Controls */}
      {selectedItems.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Selected ({selectedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y">
              {selectedItems.map((item) => (
                <div
                  key={item.product_id}
                  className="py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-medium text-sm flex-1 min-w-[150px]">{item.product_name}</span>
                    <Badge variant="outline" className="text-xs">{item.product_type}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeItem(item.product_id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {/* Quantity Controls */}
                    {showQuantityControls && (
                      <div className="flex items-center gap-1">
                        <Label className="text-xs text-muted-foreground">Qty{unitType === 'meters' ? ' (m)' : ''}:</Label>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
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
                          className="h-6 w-14 text-center text-xs px-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.product_id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Purchase Price */}
                    <div className="flex items-center gap-1">
                      <Label className="text-xs text-muted-foreground">Cost ₹:</Label>
                      <Input
                        type="number"
                        value={item.purchase_price}
                        onChange={(e) => updateItemPrice(item.product_id, parseFloat(e.target.value) || 0)}
                        className="h-6 w-20 text-xs px-1"
                      />
                    </div>
                    
                    {/* Total */}
                    <div className="ml-auto font-medium text-primary">
                      = ₹{(item.purchase_price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Row 3: Available Products */}
      <KitProductSelector
        productType={productType}
        filters={appliedFilters}
        selectedItems={data.items}
        onSelectProduct={handleSelectProduct}
        allowMultiple={allowMultiple}
        title={selectedItems.length === 0 ? "Select a Product" : "Add More Products"}
      />
    </div>
  );
}
