import { useState, useRef } from 'react';
import { QuotationState } from '@/hooks/use-quotation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Save, 
  Send, 
  Printer, 
  Share2, 
  Loader2, 
  FileText,
  Building2,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface QuotationSummaryProps {
  state: QuotationState;
  calculateTotals: () => {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
  };
  onSave: (status: 'draft' | 'sent') => Promise<unknown>;
  isLoading: boolean;
}

export function QuotationSummary({ 
  state, 
  calculateTotals, 
  onSave, 
  isLoading 
}: QuotationSummaryProps) {
  const [discountInput, setDiscountInput] = useState(state.discountPercentage.toString());
  const printRef = useRef<HTMLDivElement>(null);
  const totals = calculateTotals();

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CCTV Quotation - ${state.customerDetails.customer_name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1a365d; padding-bottom: 20px; }
            .header h1 { color: #1a365d; font-size: 24px; }
            .header p { color: #666; margin-top: 5px; }
            .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-box { width: 48%; }
            .info-box h3 { color: #1a365d; font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-box p { font-size: 12px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #1a365d; color: white; padding: 10px; text-align: left; font-size: 12px; }
            td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px; }
            tr:nth-child(even) { background: #f9f9f9; }
            .totals { margin-left: auto; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .totals-row.grand { border-top: 2px solid #1a365d; font-weight: bold; font-size: 16px; color: #1a365d; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #666; }
            .badge { display: inline-block; padding: 2px 8px; background: #e2e8f0; border-radius: 4px; font-size: 10px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <div class="footer">
            <p>This is a computer-generated quotation. Valid for 30 days from the date of issue.</p>
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async (method: 'whatsapp' | 'email') => {
    const message = `
CCTV Quotation for ${state.customerDetails.customer_name}
-----------------------------------------
System Type: ${state.systemType?.toUpperCase()}
Location: ${state.customerDetails.city}

Items: ${state.items.length}
Subtotal: ₹${totals.subtotal.toLocaleString()}
Discount: ₹${totals.discountAmount.toLocaleString()}
Tax (18%): ₹${totals.taxAmount.toLocaleString()}
-----------------------------------------
TOTAL: ₹${totals.totalAmount.toLocaleString()}

Contact us for any questions!
    `.trim();

    if (method === 'whatsapp') {
      const phone = state.customerDetails.customer_mobile.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      const subject = `CCTV Quotation - ${state.customerDetails.customer_name}`;
      window.open(`mailto:${state.customerDetails.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const groupedItems = state.items.reduce((acc, item) => {
    if (!acc[item.category_type]) acc[item.category_type] = [];
    acc[item.category_type].push(item);
    return acc;
  }, {} as Record<string, typeof state.items>);

  const categoryLabels: Record<string, string> = {
    camera: 'Cameras',
    dvr: 'DVR',
    nvr: 'NVR',
    hdd: 'Hard Disks',
    power: 'Power & Backup',
    enclosure: 'Enclosures',
    display: 'Displays',
    cabling: 'Cabling & Connectors',
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 py-4">
          <Button onClick={() => onSave('draft')} disabled={isLoading} variant="outline">
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Draft
          </Button>
          <Button onClick={() => onSave('sent')} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Send Quotation
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print PDF
          </Button>
          <Button variant="outline" onClick={() => handleShare('whatsapp')}>
            <Share2 className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          <Button variant="outline" onClick={() => handleShare('email')}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </CardContent>
      </Card>

      {/* Printable Content */}
      <div ref={printRef}>
        <Card className="print:shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  CCTV System Quotation
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  System Type: <Badge variant="secondary">{state.systemType?.toUpperCase()}</Badge>
                </p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
                <p>Valid for: 30 days</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  Customer Details
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
                  <p className="font-medium">{state.customerDetails.customer_name}</p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {state.customerDetails.customer_mobile}
                  </p>
                  {state.customerDetails.customer_email && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {state.customerDetails.customer_email}
                    </p>
                  )}
                  {state.customerDetails.gst_number && (
                    <p className="text-muted-foreground">GST: {state.customerDetails.gst_number}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  Installation Address
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <p>{state.customerDetails.installation_address}</p>
                  <p className="font-medium mt-1">{state.customerDetails.city}</p>
                </div>
              </div>
            </div>

            {/* Items by Category */}
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-semibold mb-2 text-sm">{categoryLabels[category] || category}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <span className="font-medium">{item.product_name}</span>
                            {item.product_sku && (
                              <span className="text-xs text-muted-foreground block">
                                SKU: {item.product_sku}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.unit_price.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₹{item.total_price.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>Discount</span>
                    <Input
                      type="number"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      className="w-16 h-6 text-xs text-center print:hidden"
                      min={0}
                      max={100}
                    />
                    <span className="text-muted-foreground print:hidden">%</span>
                  </div>
                  <span className="text-destructive">-₹{totals.discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (18% GST)</span>
                  <span>₹{totals.taxAmount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="text-primary">₹{totals.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {state.customerDetails.notes && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2">Special Instructions</h3>
                <p className="text-sm text-muted-foreground">{state.customerDetails.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
