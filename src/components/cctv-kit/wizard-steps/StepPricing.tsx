import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Calculator, IndianRupee, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KitWizardData } from '@/types/cctv-kit';

interface StepPricingProps {
  data: KitWizardData;
  onChange: (updates: Partial<KitWizardData>) => void;
}

export function StepPricing({ data, onChange }: StepPricingProps) {
  const totalPurchaseCost = data.items.reduce(
    (sum, item) => sum + (item.purchase_price * item.quantity),
    0
  );
  
  const profitAmount = data.selling_price - totalPurchaseCost;
  const profitPercentage = totalPurchaseCost > 0 
    ? (profitAmount / totalPurchaseCost) * 100 
    : 0;
  
  const isProfitable = profitAmount > 0;
  
  // Suggested prices
  const suggestedPrices = [
    { label: '10% Profit', value: Math.round(totalPurchaseCost * 1.1) },
    { label: '15% Profit', value: Math.round(totalPurchaseCost * 1.15) },
    { label: '20% Profit', value: Math.round(totalPurchaseCost * 1.2) },
    { label: '25% Profit', value: Math.round(totalPurchaseCost * 1.25) },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Kit Pricing & Profit Calculation
        </CardTitle>
        <CardDescription>
          Set your selling price and see real-time profit calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Summary */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Cost Breakdown
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{data.items.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Purchase Cost</p>
              <p className="text-2xl font-bold text-primary">
                ₹{totalPurchaseCost.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Selling Price Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base">Selling Price (₹)</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                value={data.selling_price}
                onChange={(e) => onChange({ selling_price: parseFloat(e.target.value) || 0 })}
                className="pl-10 text-lg h-12"
                placeholder="Enter selling price"
              />
            </div>
          </div>
          
          {/* Quick Price Suggestions */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrices.map((suggestion) => (
                <button
                  key={suggestion.label}
                  onClick={() => onChange({ selling_price: suggestion.value })}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full border transition-colors",
                    data.selling_price === suggestion.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted"
                  )}
                >
                  {suggestion.label} (₹{suggestion.value.toLocaleString()})
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Profit Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className={cn(
            "p-4 rounded-lg",
            isProfitable ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
          )}>
            <div className="flex items-center gap-2 mb-2">
              {isProfitable ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <p className="text-sm font-medium text-muted-foreground">Profit Amount</p>
            </div>
            <p className={cn(
              "text-3xl font-bold",
              isProfitable ? "text-green-600" : "text-red-600"
            )}>
              {isProfitable ? '+' : '-'}₹{Math.abs(profitAmount).toLocaleString()}
            </p>
          </div>
          
          <div className={cn(
            "p-4 rounded-lg",
            isProfitable ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Profit Percentage</p>
            </div>
            <p className={cn(
              "text-3xl font-bold",
              isProfitable ? "text-green-600" : "text-red-600"
            )}>
              {isProfitable ? '+' : ''}{profitPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
        
        {!isProfitable && data.selling_price > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              ⚠️ Warning: You're selling below cost. Consider adjusting your price.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
