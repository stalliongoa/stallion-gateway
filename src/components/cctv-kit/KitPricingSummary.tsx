import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, IndianRupee, Percent, Package, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KitItemSelection } from '@/types/cctv-kit';

interface KitPricingSummaryProps {
  items: KitItemSelection[];
  sellingPrice: number;
  hasFreeWifiCamera: boolean;
}

export function KitPricingSummary({ 
  items, 
  sellingPrice,
  hasFreeWifiCamera,
}: KitPricingSummaryProps) {
  const totalPurchaseCost = items.reduce(
    (sum, item) => sum + (item.purchase_price * item.quantity),
    0
  );
  
  const profitAmount = sellingPrice - totalPurchaseCost;
  const profitPercentage = totalPurchaseCost > 0 
    ? (profitAmount / totalPurchaseCost) * 100 
    : 0;
  
  const isProfitable = profitAmount > 0;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <IndianRupee className="h-4 w-4" />
          Pricing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Kit Components ({items.length})
          </p>
          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  {item.is_free_item && (
                    <Gift className="h-3 w-3 text-green-500 flex-shrink-0" />
                  )}
                  <span className="truncate">
                    {item.product_name}
                  </span>
                  {item.quantity > 1 && (
                    <Badge variant="secondary" className="text-xs">
                      x{item.quantity}
                      {item.unit_type === 'meters' ? 'm' : ''}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  "font-medium flex-shrink-0 ml-2",
                  item.is_free_item && "text-green-500"
                )}>
                  {item.is_free_item ? 'FREE' : `₹${(item.purchase_price * item.quantity).toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Totals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Purchase Cost</span>
            <span className="font-medium">₹{totalPurchaseCost.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Selling Price</span>
            <span className="font-medium text-primary">₹{sellingPrice.toLocaleString()}</span>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profit</span>
            <div className="flex items-center gap-2">
              {isProfitable ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                "font-bold",
                isProfitable ? "text-green-600" : "text-destructive"
              )}>
                ₹{Math.abs(profitAmount).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profit %</span>
            <div className="flex items-center gap-1">
              <Percent className="h-3 w-3" />
              <span className={cn(
                "font-bold",
                isProfitable ? "text-green-600" : "text-destructive"
              )}>
                {profitPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        {hasFreeWifiCamera && (
          <>
            <Separator />
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <Gift className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Free WiFi Camera included
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
