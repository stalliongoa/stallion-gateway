import { WizardStep, CCTVSystemType, SpecDefinition } from '@/types/quotation';
import { QuotationState } from '@/hooks/use-quotation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, Monitor, Camera } from 'lucide-react';

interface QuotationWizardStepProps {
  step: WizardStep;
  state: QuotationState;
  setSystemType: (type: CCTVSystemType) => void;
  updateCustomerDetails: (details: Partial<QuotationState['customerDetails']>) => void;
  specDefinitions: SpecDefinition[];
}

const systemTypeOptions = [
  {
    value: 'analog',
    label: 'Analog',
    description: 'Traditional coaxial cable-based CCTV systems with DVR',
    icon: Camera,
  },
  {
    value: 'ip',
    label: 'IP',
    description: 'Network-based cameras with NVR for high-resolution recording',
    icon: Monitor,
  },
  {
    value: 'wifi',
    label: 'WiFi',
    description: 'Wireless cameras for flexible installation without cables',
    icon: Wifi,
  },
];

export function QuotationWizardStep({
  step,
  state,
  setSystemType,
  updateCustomerDetails,
}: QuotationWizardStepProps) {
  if (step.key === 'system_type') {
    return (
      <div className="space-y-4">
        <RadioGroup
          value={state.systemType || ''}
          onValueChange={(value) => setSystemType(value as CCTVSystemType)}
        >
          <div className="grid gap-4">
            {systemTypeOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className="cursor-pointer"
              >
                <Card
                  className={`transition-all ${
                    state.systemType === option.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-lg ${
                      state.systemType === option.value 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <option.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                    {state.systemType === option.value && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">✓</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Label>
            ))}
          </div>
        </RadioGroup>
      </div>
    );
  }

  if (step.key === 'customer') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name *</Label>
            <Input
              id="customer_name"
              value={state.customerDetails.customer_name}
              onChange={(e) => updateCustomerDetails({ customer_name: e.target.value })}
              placeholder="Enter customer name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_mobile">Mobile Number *</Label>
            <Input
              id="customer_mobile"
              value={state.customerDetails.customer_mobile}
              onChange={(e) => updateCustomerDetails({ customer_mobile: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_email">Email</Label>
            <Input
              id="customer_email"
              type="email"
              value={state.customerDetails.customer_email}
              onChange={(e) => updateCustomerDetails({ customer_email: e.target.value })}
              placeholder="customer@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gst_number">GST Number</Label>
            <Input
              id="gst_number"
              value={state.customerDetails.gst_number}
              onChange={(e) => updateCustomerDetails({ gst_number: e.target.value })}
              placeholder="Enter GST number (optional)"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="installation_address">Installation Address *</Label>
          <Textarea
            id="installation_address"
            value={state.customerDetails.installation_address}
            onChange={(e) => updateCustomerDetails({ installation_address: e.target.value })}
            placeholder="Enter complete installation address"
            rows={2}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={state.customerDetails.city}
            onChange={(e) => updateCustomerDetails({ city: e.target.value })}
            placeholder="Enter city"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Special Instructions / Notes</Label>
          <Textarea
            id="notes"
            value={state.customerDetails.notes}
            onChange={(e) => updateCustomerDetails({ notes: e.target.value })}
            placeholder="Any special requirements or instructions"
            rows={3}
          />
        </div>
      </div>
    );
  }

  // For product selection steps, we show instructions
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">Instructions</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Use the filters on the right to narrow down products</li>
          <li>• Select quantity for each product you want to add</li>
          <li>• Click "Add to Quotation" to include the product</li>
          <li>• You can add multiple products of this type</li>
        </ul>
      </div>
      {step.key === 'recorder' && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm">
            {state.systemType === 'analog' 
              ? 'Showing DVR options for your Analog CCTV system'
              : 'Showing NVR options for your IP CCTV system'
            }
          </p>
        </div>
      )}
    </div>
  );
}
