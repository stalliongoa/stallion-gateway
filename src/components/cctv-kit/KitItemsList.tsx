import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, Trash2 } from 'lucide-react';
import type { KitItemSelection } from '@/types/cctv-kit';

interface KitItemsListProps {
  items: KitItemSelection[];
  onRemoveItem?: (productId: string | null, productType: string) => void;
  showRemove?: boolean;
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

export function KitItemsList({ items, onRemoveItem, showRemove = true }: KitItemsListProps) {
  if (items.length === 0) {
    return null;
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

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Kit Items ({items.length})
          </span>
          <Badge variant="secondary" className="text-xs">
            Total: ₹{totalCost.toLocaleString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-[200px]">
          <div className="space-y-2">
            {Object.entries(groupedItems).map(([type, typeItems]) => (
              <div key={type} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {productTypeLabels[type] || type}
                </p>
                {typeItems.map((item, index) => (
                  <div
                    key={`${item.product_id}-${index}`}
                    className="flex items-center justify-between gap-2 p-2 bg-background rounded border text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product_name}</p>
                      <p className="text-muted-foreground">
                        {item.quantity} {item.unit_type === 'meters' ? 'm' : 'pcs'} × ₹{item.purchase_price.toLocaleString()} = ₹{(item.quantity * item.purchase_price).toLocaleString()}
                      </p>
                    </div>
                    {showRemove && onRemoveItem && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => onRemoveItem(item.product_id, item.product_type)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
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
