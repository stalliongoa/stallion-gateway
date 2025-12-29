import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FileText, Printer, Download, Search, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Order, OrderItem, Address } from '@/types/shop';

export default function ShopAdminInvoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-invoices', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('shop_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('payment_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(order => ({
        ...order,
        status: order.status as Order['status'],
        payment_status: order.payment_status as Order['payment_status'],
        shipping_address: order.shipping_address as unknown as Address | null,
        billing_address: order.billing_address as unknown as Address | null,
      })) as Order[];
    }
  });

  const fetchOrderItems = async (orderId: string) => {
    const { data, error } = await supabase
      .from('shop_order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) throw error;
    return data as OrderItem[];
  };

  const handleViewInvoice = async (order: Order) => {
    setSelectedOrder(order);
    const items = await fetchOrderItems(order.id);
    setOrderItems(items);
    setIsInvoiceOpen(true);
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${selectedOrder?.order_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #1e3a5f; color: white; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e3a5f; }
            .invoice-title { font-size: 28px; color: #ff6b35; }
            .address { margin: 10px 0; }
            .total-row { font-weight: bold; background-color: #f5f5f5; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredOrders = orders?.filter(order => 
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-shop-navy">Invoices</h1>
          <p className="text-muted-foreground">View and print order invoices</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Order Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-shop-orange" />
            </div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {order.billing_address?.name || order.shipping_address?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{Number(order.total_amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInvoice(order)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Modal */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Invoice - {selectedOrder?.order_number}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div ref={invoiceRef} className="p-6 bg-white">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-shop-navy">Shoppie STALLION</h1>
                  <p className="text-sm text-muted-foreground mt-1">Your Electronics Partner</p>
                  <div className="mt-4 text-sm">
                    <p>Stallion Security & IT Solutions</p>
                    <p>Panjim, Goa, India</p>
                    <p>Phone: +91 832 251 3159</p>
                    <p>Email: sales@stallion.co.in</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-shop-orange">INVOICE</h2>
                  <div className="mt-4 text-sm">
                    <p><strong>Invoice No:</strong> {selectedOrder.order_number}</p>
                    <p><strong>Date:</strong> {format(new Date(selectedOrder.created_at), 'MMMM dd, yyyy')}</p>
                    <p><strong>Payment:</strong> {selectedOrder.payment_method?.toUpperCase() || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Billing & Shipping */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-shop-navy mb-2">Bill To:</h3>
                  {selectedOrder.billing_address ? (
                    <div className="text-sm">
                      <p className="font-medium">{selectedOrder.billing_address.name}</p>
                      <p>{selectedOrder.billing_address.line1}</p>
                      {selectedOrder.billing_address.line2 && <p>{selectedOrder.billing_address.line2}</p>}
                      <p>{selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.pincode}</p>
                      <p>Phone: {selectedOrder.billing_address.phone}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Same as shipping</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-shop-navy mb-2">Ship To:</h3>
                  {selectedOrder.shipping_address && (
                    <div className="text-sm">
                      <p className="font-medium">{selectedOrder.shipping_address.name}</p>
                      <p>{selectedOrder.shipping_address.line1}</p>
                      {selectedOrder.shipping_address.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pincode}</p>
                      <p>Phone: {selectedOrder.shipping_address.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse mb-8">
                <thead>
                  <tr className="bg-shop-navy text-white">
                    <th className="border p-3 text-left">#</th>
                    <th className="border p-3 text-left">Description</th>
                    <th className="border p-3 text-left">SKU</th>
                    <th className="border p-3 text-right">Qty</th>
                    <th className="border p-3 text-right">Unit Price</th>
                    <th className="border p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border p-3">{index + 1}</td>
                      <td className="border p-3">{item.product_name}</td>
                      <td className="border p-3">{item.product_sku || '-'}</td>
                      <td className="border p-3 text-right">{item.quantity}</td>
                      <td className="border p-3 text-right">₹{Number(item.unit_price).toLocaleString()}</td>
                      <td className="border p-3 text-right">₹{Number(item.total_price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{Number(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>₹{Number(selectedOrder.tax_amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{Number(selectedOrder.shipping_amount || 0) === 0 ? 'Free' : `₹${Number(selectedOrder.shipping_amount)}`}</span>
                  </div>
                  {Number(selectedOrder.discount_amount || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{Number(selectedOrder.discount_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-shop-orange">₹{Number(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                <p>Thank you for your business!</p>
                <p className="mt-2">For any queries, please contact us at sales@stallion.co.in</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
