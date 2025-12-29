import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, FileText, Download } from 'lucide-react';
import { ShopAdminLayout } from './ShopAdminLayout';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Purchase {
  id: string;
  purchase_number: string;
  vendor_id: string | null;
  product_id: string | null;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  gst_rate: number;
  gst_amount: number;
  invoice_number: string | null;
  invoice_url: string | null;
  invoice_date: string | null;
  purchase_date: string | null;
  payment_status: string;
  notes: string | null;
  created_at: string;
  vendor?: { name: string };
  product?: { name: string; sku: string | null };
}

interface Vendor {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  purchase_price: number | null;
}

export default function ShopAdminPurchases() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    vendor_id: '',
    product_id: '',
    quantity: '',
    unit_cost: '',
    gst_rate: '18',
    invoice_number: '',
    invoice_url: '',
    purchase_date: format(new Date(), 'yyyy-MM-dd'),
    payment_status: 'pending',
    notes: '',
  });

  useEffect(() => {
    fetchPurchases();
    fetchVendors();
    fetchProducts();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shop_purchases')
      .select(`
        *,
        shop_vendors(name),
        shop_products(name, sku)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching purchases', variant: 'destructive' });
    } else if (data) {
      const mapped = data.map((p: any) => ({
        ...p,
        vendor: p.shop_vendors,
        product: p.shop_products,
      }));
      setPurchases(mapped);
    }
    setLoading(false);
  };

  const fetchVendors = async () => {
    const { data } = await supabase
      .from('shop_vendors')
      .select('id, name')
      .eq('is_active', true)
      .order('name');
    if (data) setVendors(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('shop_products')
      .select('id, name, sku, purchase_price')
      .eq('is_active', true)
      .order('name');
    if (data) setProducts(data);
  };

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setFormData(prev => ({
      ...prev,
      product_id: productId,
      unit_cost: product?.purchase_price?.toString() || prev.unit_cost,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.vendor_id || !formData.product_id || !formData.quantity || !formData.unit_cost) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const quantity = parseInt(formData.quantity);
    const unitCost = parseFloat(formData.unit_cost);
    const gstRate = parseFloat(formData.gst_rate) || 18;
    const subtotal = quantity * unitCost;
    const gstAmount = subtotal * (gstRate / 100);
    const totalCost = subtotal + gstAmount;

    // Generate purchase number
    const { data: purchaseNumber } = await supabase.rpc('generate_purchase_number');

    // Create purchase entry
    const { data: purchase, error } = await supabase
      .from('shop_purchases')
      .insert({
        purchase_number: purchaseNumber,
        vendor_id: formData.vendor_id,
        product_id: formData.product_id,
        quantity,
        unit_cost: unitCost,
        total_cost: totalCost,
        gst_rate: gstRate,
        gst_amount: gstAmount,
        invoice_number: formData.invoice_number || null,
        invoice_url: formData.invoice_url || null,
        purchase_date: formData.purchase_date || null,
        payment_status: formData.payment_status,
        notes: formData.notes || null,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating purchase', description: error.message, variant: 'destructive' });
      return;
    }

    // Update product stock
    const { data: product } = await supabase
      .from('shop_products')
      .select('stock_quantity')
      .eq('id', formData.product_id)
      .single();

    const newStock = (product?.stock_quantity || 0) + quantity;

    await supabase
      .from('shop_products')
      .update({ 
        stock_quantity: newStock,
        last_purchase_price: unitCost,
      })
      .eq('id', formData.product_id);

    // Log stock movement
    await supabase.from('stock_movements').insert({
      product_id: formData.product_id,
      action_type: 'purchase',
      quantity_change: quantity,
      quantity_before: product?.stock_quantity || 0,
      quantity_after: newStock,
      reference_type: 'purchase',
      reference_id: purchase?.id,
      reason: 'Purchase from vendor',
      notes: `Invoice: ${formData.invoice_number || 'N/A'}`,
    });

    toast({ title: 'Purchase created successfully' });
    setDialogOpen(false);
    setFormData({
      vendor_id: '',
      product_id: '',
      quantity: '',
      unit_cost: '',
      gst_rate: '18',
      invoice_number: '',
      invoice_url: '',
      purchase_date: format(new Date(), 'yyyy-MM-dd'),
      payment_status: 'pending',
      notes: '',
    });
    fetchPurchases();
  };

  const getPaymentBadge = (status: string) => {
    const badges: Record<string, { className: string }> = {
      pending: { className: 'bg-yellow-500/20 text-yellow-600' },
      partial: { className: 'bg-blue-500/20 text-blue-600' },
      paid: { className: 'bg-green-500/20 text-green-600' },
    };
    return <Badge variant="secondary" className={badges[status]?.className}>{status}</Badge>;
  };

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = 
      p.purchase_number.toLowerCase().includes(search.toLowerCase()) ||
      (p.vendor?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.product?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.invoice_number || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || p.payment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPurchaseValue = purchases.reduce((sum, p) => sum + (p.total_cost || 0), 0);
  const pendingPayments = purchases
    .filter(p => p.payment_status !== 'paid')
    .reduce((sum, p) => sum + (p.total_cost || 0), 0);

  return (
    <ShopAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Purchase Management</h1>
            <p className="text-muted-foreground">Track vendor purchases and incoming stock</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Purchase
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalPurchaseValue.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">₹{pendingPayments.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search purchases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Purchases Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purchase #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : filteredPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No purchases found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.purchase_number}</TableCell>
                      <TableCell>
                        {purchase.purchase_date 
                          ? format(new Date(purchase.purchase_date), 'MMM dd, yyyy')
                          : format(new Date(purchase.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{purchase.vendor?.name || '-'}</TableCell>
                      <TableCell>
                        <div>{purchase.product?.name}</div>
                        <div className="text-xs text-muted-foreground">{purchase.product?.sku}</div>
                      </TableCell>
                      <TableCell className="text-center">{purchase.quantity}</TableCell>
                      <TableCell className="text-right">₹{purchase.unit_cost.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right font-medium">₹{purchase.total_cost.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{getPaymentBadge(purchase.payment_status)}</TableCell>
                      <TableCell>
                        {purchase.invoice_number || '-'}
                        {purchase.invoice_url && (
                          <a href={purchase.invoice_url} target="_blank" rel="noopener noreferrer" className="ml-2">
                            <FileText className="h-4 w-4 inline text-primary" />
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* New Purchase Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Purchase</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vendor *</Label>
                <Select value={formData.vendor_id} onValueChange={(v) => setFormData(prev => ({ ...prev, vendor_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Product *</Label>
                <Select value={formData.product_id} onValueChange={handleProductChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
              <div>
                <Label>Unit Cost (₹) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.unit_cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit_cost: e.target.value }))}
                />
              </div>
              <div>
                <Label>GST Rate (%)</Label>
                <Input
                  type="number"
                  value={formData.gst_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, gst_rate: e.target.value }))}
                />
              </div>
              <div>
                <Label>Purchase Date</Label>
                <Input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
                />
              </div>
              <div>
                <Label>Invoice Number</Label>
                <Input
                  value={formData.invoice_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_number: e.target.value }))}
                />
              </div>
              <div>
                <Label>Invoice URL</Label>
                <Input
                  value={formData.invoice_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Payment Status</Label>
                <Select value={formData.payment_status} onValueChange={(v) => setFormData(prev => ({ ...prev, payment_status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>
              
              {formData.quantity && formData.unit_cost && (
                <div className="col-span-2 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Subtotal</div>
                      <div className="font-medium">
                        ₹{(parseFloat(formData.quantity) * parseFloat(formData.unit_cost)).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">GST ({formData.gst_rate}%)</div>
                      <div className="font-medium">
                        ₹{(parseFloat(formData.quantity) * parseFloat(formData.unit_cost) * (parseFloat(formData.gst_rate) / 100)).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total</div>
                      <div className="font-bold">
                        ₹{(parseFloat(formData.quantity) * parseFloat(formData.unit_cost) * (1 + parseFloat(formData.gst_rate) / 100)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Create Purchase</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ShopAdminLayout>
  );
}