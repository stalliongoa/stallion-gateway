import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuotationAuth, QuotationAuthProvider } from '@/hooks/use-quotation-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowLeft, 
  Printer, 
  Share2, 
  Mail, 
  Loader2,
  FileText,
  Building2,
  MapPin,
  Phone,
  Shield,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface QuotationItem {
  id: string;
  product_name: string;
  product_sku: string | null;
  category_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Quotation {
  id: string;
  quotation_number: string;
  engineer_id: string;
  status: string;
  cctv_system_type: string;
  customer_name: string;
  customer_mobile: string;
  customer_email: string | null;
  installation_address: string;
  city: string;
  gst_number: string | null;
  notes: string | null;
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  valid_until: string | null;
  created_at: string;
}

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

function QuotationDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading, canAccessQuotations } = useQuotationAuth();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/shop/auth?redirect=/quotation/' + id);
    } else if (user && canAccessQuotations && id) {
      fetchQuotation();
    }
  }, [authLoading, user, canAccessQuotations, id, navigate]);

  const fetchQuotation = async () => {
    try {
      const { data: quotationData, error: quotationError } = await supabase
        .from('cctv_quotations')
        .select('*')
        .eq('id', id)
        .single();

      if (quotationError) throw quotationError;
      setQuotation(quotationData);

      const { data: itemsData, error: itemsError } = await supabase
        .from('cctv_quotation_items')
        .select('*')
        .eq('quotation_id', id)
        .order('display_order');

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching quotation:', error);
      toast.error('Failed to load quotation');
      navigate('/quotation-list');
    } finally {
      setIsLoading(false);
    }
  };

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
          <title>CCTV Quotation - ${quotation?.quotation_number}</title>
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
    if (!quotation) return;

    const message = `
CCTV Quotation ${quotation.quotation_number}
-----------------------------------------
Customer: ${quotation.customer_name}
System Type: ${quotation.cctv_system_type.toUpperCase()}
Location: ${quotation.city}

Items: ${items.length}
Subtotal: ₹${quotation.subtotal.toLocaleString()}
Discount: ₹${quotation.discount_amount.toLocaleString()}
Tax (18%): ₹${quotation.tax_amount.toLocaleString()}
-----------------------------------------
TOTAL: ₹${quotation.total_amount.toLocaleString()}

Contact us for any questions!
    `.trim();

    if (method === 'whatsapp') {
      const phone = quotation.customer_mobile.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (quotation.customer_email) {
      const subject = `CCTV Quotation ${quotation.quotation_number}`;
      window.open(`mailto:${quotation.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`, '_blank');
    } else {
      toast.error('No email address available');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'converted': return 'default';
      default: return 'secondary';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canAccessQuotations) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Access Restricted</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You don't have permission to view this quotation.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (!quotation) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Quotation Not Found</h3>
              <Button onClick={() => navigate('/quotation-list')} variant="outline">
                Back to Quotations
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category_type]) acc[item.category_type] = [];
    acc[item.category_type].push(item);
    return acc;
  }, {} as Record<string, QuotationItem[]>);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/quotation-list')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quotations
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={() => handleShare('whatsapp')}>
                <Share2 className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline" onClick={() => handleShare('email')}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* Printable Content */}
          <div ref={printRef}>
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {quotation.quotation_number}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{quotation.cctv_system_type.toUpperCase()}</Badge>
                      <Badge variant={getStatusColor(quotation.status)}>{quotation.status}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p className="flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" />
                      Created: {new Date(quotation.created_at).toLocaleDateString('en-IN')}
                    </p>
                    {quotation.valid_until && (
                      <p>Valid until: {new Date(quotation.valid_until).toLocaleDateString('en-IN')}</p>
                    )}
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
                      <p className="font-medium">{quotation.customer_name}</p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {quotation.customer_mobile}
                      </p>
                      {quotation.customer_email && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {quotation.customer_email}
                        </p>
                      )}
                      {quotation.gst_number && (
                        <p className="text-muted-foreground">GST: {quotation.gst_number}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      Installation Address
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                      <p>{quotation.installation_address}</p>
                      <p className="font-medium mt-1">{quotation.city}</p>
                    </div>
                  </div>
                </div>

                {/* Items by Category */}
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
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
                        {categoryItems.map((item) => (
                          <TableRow key={item.id}>
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
                      <span>₹{quotation.subtotal.toLocaleString()}</span>
                    </div>
                    {quotation.discount_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Discount ({quotation.discount_percentage}%)</span>
                        <span className="text-destructive">-₹{quotation.discount_amount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Tax (18% GST)</span>
                      <span>₹{quotation.tax_amount.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Grand Total</span>
                      <span className="text-primary">₹{quotation.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {quotation.notes && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-sm mb-2">Special Instructions</h3>
                    <p className="text-sm text-muted-foreground">{quotation.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function QuotationDetail() {
  return (
    <QuotationAuthProvider>
      <QuotationDetailContent />
    </QuotationAuthProvider>
  );
}
