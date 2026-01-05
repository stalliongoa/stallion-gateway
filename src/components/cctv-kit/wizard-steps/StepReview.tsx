import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Package, Camera, HardDrive, Monitor, Cable, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KitWizardData, ProductType } from '@/types/cctv-kit';

interface StepReviewProps {
  data: KitWizardData;
}

const PRODUCT_TYPE_ICONS: Record<ProductType, React.ReactNode> = {
  camera: <Camera className="h-4 w-4" />,
  dvr: <HardDrive className="h-4 w-4" />,
  nvr: <HardDrive className="h-4 w-4" />,
  smps: <Package className="h-4 w-4" />,
  hard_drive: <HardDrive className="h-4 w-4" />,
  cable: <Cable className="h-4 w-4" />,
  monitor: <Monitor className="h-4 w-4" />,
  ups: <Package className="h-4 w-4" />,
  rack: <Package className="h-4 w-4" />,
  accessory: <Package className="h-4 w-4" />,
  wifi_camera: <Camera className="h-4 w-4" />,
};

export function StepReview({ data }: StepReviewProps) {
  const totalPurchaseCost = data.items.reduce(
    (sum, item) => sum + (item.purchase_price * item.quantity),
    0
  );
  const profitAmount = data.selling_price - totalPurchaseCost;
  const profitPercentage = totalPurchaseCost > 0 
    ? (profitAmount / totalPurchaseCost) * 100 
    : 0;
  
  const validationChecks = [
    { label: 'Kit Name', valid: !!data.name },
    { label: 'Brand Selected', valid: !!data.brand_id },
    { label: 'Camera Added', valid: data.items.some(i => i.product_type === 'camera') },
    { label: 'DVR Added', valid: data.items.some(i => i.product_type === 'dvr') },
    { label: 'Selling Price Set', valid: data.selling_price > 0 },
    { label: 'Kit Image Uploaded', valid: !!data.image_url },
  ];
  
  const allValid = validationChecks.every(c => c.valid);
  
  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Validation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {validationChecks.map((check) => (
              <div
                key={check.label}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  check.valid ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
                )}
              >
                {check.valid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">{check.label}</span>
              </div>
            ))}
          </div>
          
          {!allValid && (
            <p className="text-sm text-destructive mt-4">
              Please complete all required fields before saving.
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Kit Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Kit Summary</CardTitle>
          <CardDescription>Review all kit details before saving</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Kit Name</p>
              <p className="font-medium">{data.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <Badge variant="outline">{data.kit_type.toUpperCase()}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Channels</p>
              <p className="font-medium">{data.channel_capacity} CH</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Resolution</p>
              <p className="font-medium">{data.camera_resolution}</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Items */}
          <div>
            <p className="text-sm font-medium mb-3">Kit Components ({data.items.length})</p>
            <div className="space-y-2">
              {data.items.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    item.is_free_item && "bg-green-50 dark:bg-green-950 border-green-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      {PRODUCT_TYPE_ICONS[item.product_type]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.product_name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.product_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Qty: {item.quantity}{item.unit_type === 'meters' ? 'm' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {item.is_free_item ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Gift className="h-4 w-4" />
                        <span className="font-medium">FREE</span>
                      </div>
                    ) : (
                      <p className="font-medium">
                        ₹{(item.purchase_price * item.quantity).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Pricing */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Total Cost</p>
              <p className="text-xl font-bold">₹{totalPurchaseCost.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground">Selling Price</p>
              <p className="text-xl font-bold text-primary">₹{data.selling_price.toLocaleString()}</p>
            </div>
            <div className={cn(
              "p-3 rounded-lg",
              profitAmount >= 0 ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
            )}>
              <p className="text-xs text-muted-foreground">Profit</p>
              <p className={cn(
                "text-xl font-bold",
                profitAmount >= 0 ? "text-green-600" : "text-red-600"
              )}>
                ₹{profitAmount.toLocaleString()}
              </p>
            </div>
            <div className={cn(
              "p-3 rounded-lg",
              profitAmount >= 0 ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
            )}>
              <p className="text-xs text-muted-foreground">Profit %</p>
              <p className={cn(
                "text-xl font-bold",
                profitAmount >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {profitPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
          
          {/* Image Preview */}
          {data.image_url && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-3">Kit Image</p>
                <img
                  src={data.image_url}
                  alt="Kit preview"
                  className="max-h-48 rounded-lg"
                />
              </div>
            </>
          )}
          
          {/* Highlights */}
          {data.short_highlights.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-3">Highlights</p>
                <ul className="list-disc list-inside space-y-1">
                  {data.short_highlights.map((h, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{h}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
