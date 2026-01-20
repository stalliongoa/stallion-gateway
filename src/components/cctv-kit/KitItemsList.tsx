import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, Trash2, Minus, Plus, Pencil } from 'lucide-react';
import type { KitItemSelection } from '@/types/cctv-kit';

interface KitItemsListProps {
  items: KitItemSelection[];
  onRemoveItem?: (productId: string | null, productType: string) => void;
  onUpdateQuantity?: (productId: string | null, productType: string, quantity: number) => void;
  onUpdatePrice?: (productId: string | null, productType: string, price: number) => void;
  showRemove?: boolean;
  editable?: boolean;
  compact?: boolean;
}

const productTypeLabels: Record<string, string> = {
  camera: 'Camera',
  dvr: 'DVR',
  nvr: 'NVR',
  smps: 'SMPS',
  hard_drive: 'Hard Drive',
  cable: 'Cable',
  monitor: 'Monitor',
  ups: 'UPS',
  rack: 'Rack',
  accessory: 'Accessory',
  wifi_camera: 'WiFi Camera',
};

export function KitItemsList({ 
  items, 
  onRemoveItem, 
  onUpdateQuantity,
  onUpdatePrice,
  showRemove = true,
  editable = false,
  compact = false,
}: KitItemsListProps) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">No items added yet</p>
          <p className="text-xs text-muted-foreground mt-1">Select products from the list to add to kit</p>
        </CardContent>
      </Card>
    );
  }

  // Group items by product type
  const groupedItems = items.reduce((acc, item) => {
    const type = item.product_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {} as Record<string, KitItemSelection[]>);

  const totalCost = items.reduce((sum, item) => sum + (item.purchase_price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Kit Items ({items.length} products, {totalItems} units)
          </span>
          <Badge variant="secondary" className="text-xs font-semibold">
            ₹{totalCost.toLocaleString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className={compact ? "max-h-[250px]" : "max-h-[350px]"}>
          <div className="space-y-3">
            {Object.entries(groupedItems).map(([type, typeItems]) => (
              <div key={type} className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  {productTypeLabels[type] || type}
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                    {typeItems.length}
                  </Badge>
                </p>
                {typeItems.map((item, index) => (
                  <div
                    key={`${item.product_id}-${index}`}
                    className="p-2 bg-background rounded-lg border text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm leading-tight flex-1">{item.product_name}</p>
                      {showRemove && onRemoveItem && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          onClick={() => onRemoveItem(item.product_id, item.product_type)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    {editable && onUpdateQuantity && onUpdatePrice ? (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-[10px] mr-0.5">Qty:</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => onUpdateQuantity(item.product_id, item.product_type, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => onUpdateQuantity(item.product_id, item.product_type, Math.max(1, parseInt(e.target.value) || 1))}
                            className="h-5 w-12 text-center text-[10px] px-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => onUpdateQuantity(item.product_id, item.product_type, item.quantity + 1)}
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </Button>
                          {item.unit_type === 'meters' && (
                            <span className="text-muted-foreground text-[10px]">m</span>
                          )}
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-[10px]">₹</span>
                          <Input
                            type="number"
                            value={item.purchase_price}
                            onChange={(e) => onUpdatePrice(item.product_id, item.product_type, parseFloat(e.target.value) || 0)}
                            className="h-5 w-16 text-[10px] px-1"
                          />
                        </div>
                        
                        {/* Total */}
                        <div className="ml-auto font-semibold text-primary text-xs">
                          = ₹{(item.quantity * item.purchase_price).toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {item.quantity} {item.unit_type === 'meters' ? 'm' : 'pcs'} × ₹{item.purchase_price.toLocaleString()} = <span className="font-semibold text-foreground">₹{(item.quantity * item.purchase_price).toLocaleString()}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
