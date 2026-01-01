import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Upload, Sparkles, Loader2, UserPlus } from 'lucide-react';
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
  DialogDescription,
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
  gst_number: string | null;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  purchase_price: number | null;
}

interface ExtractedVendor {
  vendor_name: string | null;
  vendor_gst_number: string | null;
  vendor_address: string | null;
  vendor_phone: string | null;
  vendor_email: string | null;
  vendor_contact_person: string | null;
}

interface ExtractedItem {
  product_name: string;
  product_sku: string | null;
  hsn_code: string | null;
  quantity: number;
  unit_cost: number;
  gst_rate: number | null;
  total_cost: number | null;
}

interface ExtractedData extends ExtractedVendor {
  invoice_number: string | null;
  invoice_date: string | null;
  purchase_date: string | null;
  items: ExtractedItem[];
  subtotal: number | null;
  gst_amount: number | null;
  total_amount: number | null;
  payment_status: string | null;
}

export default function ShopAdminPurchases() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [matchedVendor, setMatchedVendor] = useState<Vendor | null>(null);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  const [newVendorData, setNewVendorData] = useState<ExtractedVendor | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  
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
      .select('id, name, gst_number')
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    toast({ title: 'Processing document...', description: 'AI is extracting purchase information' });

    try {
      let fileContent: string;
      let fileType: string;

      if (file.type.startsWith('image/')) {
        // Convert image to base64
        fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        fileType = 'image';
      } else if (file.type === 'application/pdf') {
        // For PDF, we'll send base64 and let AI handle it via vision
        fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        fileType = 'image'; // Treat as image for vision processing
      } else {
        // Text-based files
        fileContent = await file.text();
        fileType = 'text';
      }

      const { data, error } = await supabase.functions.invoke('extract-purchase-info', {
        body: { fileContent, fileType, mimeType: file.type },
      });

      if (error) {
        throw new Error(error.message || 'Failed to extract data');
      }

      if (data?.success && data?.data) {
        const extracted = data.data as ExtractedData;
        setExtractedData(extracted);
        
        // Try to match vendor by GST number
        if (extracted.vendor_gst_number) {
          const foundVendor = vendors.find(
            v => v.gst_number?.replace(/\s/g, '').toLowerCase() === 
                 extracted.vendor_gst_number?.replace(/\s/g, '').toLowerCase()
          );
          
          if (foundVendor) {
            setMatchedVendor(foundVendor);
            setFormData(prev => ({ ...prev, vendor_id: foundVendor.id }));
            toast({ title: 'Vendor matched!', description: `Found vendor: ${foundVendor.name}` });
          } else {
            // Offer to create new vendor
            setNewVendorData({
              vendor_name: extracted.vendor_name,
              vendor_gst_number: extracted.vendor_gst_number,
              vendor_address: extracted.vendor_address,
              vendor_phone: extracted.vendor_phone,
              vendor_email: extracted.vendor_email,
              vendor_contact_person: extracted.vendor_contact_person,
            });
            setShowVendorDialog(true);
          }
        } else if (extracted.vendor_name) {
          // Try to match by name
          const foundVendor = vendors.find(
            v => v.name.toLowerCase().includes(extracted.vendor_name!.toLowerCase()) ||
                 extracted.vendor_name!.toLowerCase().includes(v.name.toLowerCase())
          );
          
          if (foundVendor) {
            setMatchedVendor(foundVendor);
            setFormData(prev => ({ ...prev, vendor_id: foundVendor.id }));
          } else {
            setNewVendorData({
              vendor_name: extracted.vendor_name,
              vendor_gst_number: extracted.vendor_gst_number,
              vendor_address: extracted.vendor_address,
              vendor_phone: extracted.vendor_phone,
              vendor_email: extracted.vendor_email,
              vendor_contact_person: extracted.vendor_contact_person,
            });
            setShowVendorDialog(true);
          }
        }

        // Fill first item data
        if (extracted.items && extracted.items.length > 0) {
          const firstItem = extracted.items[0];
          
          // Try to match product by SKU or name
          let matchedProduct = products.find(
            p => firstItem.product_sku && p.sku?.toLowerCase() === firstItem.product_sku.toLowerCase()
          );
          if (!matchedProduct) {
            matchedProduct = products.find(
              p => p.name.toLowerCase().includes(firstItem.product_name.toLowerCase()) ||
                   firstItem.product_name.toLowerCase().includes(p.name.toLowerCase())
            );
          }

          setFormData(prev => ({
            ...prev,
            product_id: matchedProduct?.id || '',
            quantity: firstItem.quantity?.toString() || '',
            unit_cost: firstItem.unit_cost?.toString() || '',
            gst_rate: firstItem.gst_rate?.toString() || '18',
            invoice_number: extracted.invoice_number || '',
            purchase_date: extracted.purchase_date || extracted.invoice_date || prev.purchase_date,
            payment_status: extracted.payment_status || 'pending',
          }));
        }

        toast({ title: 'Data extracted successfully!', description: 'Review and fill missing fields' });
        setDialogOpen(true);
      } else {
        throw new Error(data?.error || 'Failed to extract data');
      }
    } catch (error) {
      console.error('Extraction error:', error);
      toast({ 
        title: 'Extraction failed', 
        description: error instanceof Error ? error.message : 'Could not extract data from document',
        variant: 'destructive' 
      });
    } finally {
      setExtracting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCreateVendor = async () => {
    if (!newVendorData?.vendor_name) {
      toast({ title: 'Vendor name is required', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase
      .from('shop_vendors')
      .insert({
        name: newVendorData.vendor_name,
        gst_number: newVendorData.vendor_gst_number,
        address: newVendorData.vendor_address,
        phone: newVendorData.vendor_phone,
        email: newVendorData.vendor_email,
        contact_person: newVendorData.vendor_contact_person,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Failed to create vendor', description: error.message, variant: 'destructive' });
    } else if (data) {
      toast({ title: 'Vendor created successfully' });
      setVendors(prev => [...prev, { id: data.id, name: data.name, gst_number: data.gst_number }]);
      setFormData(prev => ({ ...prev, vendor_id: data.id }));
      setMatchedVendor({ id: data.id, name: data.name, gst_number: data.gst_number });
    }
    setShowVendorDialog(false);
    setNewVendorData(null);
  };

  const handleSelectItem = (index: number) => {
    if (!extractedData?.items || index >= extractedData.items.length) return;
    
    const item = extractedData.items[index];
    setSelectedItemIndex(index);
    
    // Try to match product
    let matchedProduct = products.find(
      p => item.product_sku && p.sku?.toLowerCase() === item.product_sku.toLowerCase()
    );
    if (!matchedProduct) {
      matchedProduct = products.find(
        p => p.name.toLowerCase().includes(item.product_name.toLowerCase()) ||
             item.product_name.toLowerCase().includes(p.name.toLowerCase())
      );
    }

    setFormData(prev => ({
      ...prev,
      product_id: matchedProduct?.id || '',
      quantity: item.quantity?.toString() || '',
      unit_cost: item.unit_cost?.toString() || '',
      gst_rate: item.gst_rate?.toString() || '18',
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
    resetForm();
    fetchPurchases();
  };

  const resetForm = () => {
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
    setExtractedData(null);
    setMatchedVendor(null);
    setSelectedItemIndex(0);
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
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Purchase Management</h1>
            <p className="text-sm text-muted-foreground">Track vendor purchases and incoming stock</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => fileInputRef.current?.click()}
              disabled={extracting}
            >
              {extracting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">AI Import Invoice</span>
                  <span className="sm:hidden">AI Import</span>
                </>
              )}
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none" onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Purchase</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{purchases.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">₹{totalPurchaseValue.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-yellow-600">₹{pendingPayments.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
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
            <SelectTrigger className="w-full sm:w-[180px]">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purchase #</TableHead>
                    <TableHead className="hidden sm:table-cell">Vendor</TableHead>
                    <TableHead className="hidden md:table-cell">Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Unit Cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="hidden md:table-cell">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">Loading...</TableCell>
                    </TableRow>
                  ) : filteredPurchases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">No purchases found</TableCell>
                    </TableRow>
                  ) : (
                    filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.purchase_number}</TableCell>
                        <TableCell className="hidden sm:table-cell">{purchase.vendor?.name || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell">{purchase.product?.name || '-'}</TableCell>
                        <TableCell className="text-right">{purchase.quantity}</TableCell>
                        <TableCell className="text-right hidden sm:table-cell">₹{purchase.unit_cost?.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">₹{purchase.total_cost?.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {purchase.invoice_number ? (
                            purchase.invoice_url ? (
                              <a href={purchase.invoice_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {purchase.invoice_number}
                              </a>
                            ) : (
                              purchase.invoice_number
                            )
                          ) : '-'}
                        </TableCell>
                        <TableCell>{getPaymentBadge(purchase.payment_status)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {purchase.purchase_date ? format(new Date(purchase.purchase_date), 'dd/MM/yyyy') : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Purchase Entry</DialogTitle>
              <DialogDescription>
                {extractedData ? 'Review extracted data and fill missing fields' : 'Enter purchase details'}
              </DialogDescription>
            </DialogHeader>
            
            {/* Extracted Items Selector */}
            {extractedData?.items && extractedData.items.length > 1 && (
              <div className="mb-4">
                <Label>Select Item from Invoice ({extractedData.items.length} items found)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {extractedData.items.map((item, index) => (
                    <Button
                      key={index}
                      variant={selectedItemIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSelectItem(index)}
                    >
                      {item.product_name.substring(0, 20)}...
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Vendor *</Label>
                <Select value={formData.vendor_id} onValueChange={(v) => setFormData(prev => ({ ...prev, vendor_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(v => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} {v.gst_number && `(${v.gst_number})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {matchedVendor && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Matched: {matchedVendor.name}
                  </p>
                )}
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
                {extractedData?.items?.[selectedItemIndex] && !formData.product_id && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Extracted: {extractedData.items[selectedItemIndex].product_name}
                  </p>
                )}
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
              <div className="sm:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>
              
              {formData.quantity && formData.unit_cost && (
                <div className="sm:col-span-2 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs sm:text-sm">Subtotal</div>
                      <div className="font-medium text-sm sm:text-base">
                        ₹{(parseFloat(formData.quantity) * parseFloat(formData.unit_cost)).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs sm:text-sm">GST ({formData.gst_rate}%)</div>
                      <div className="font-medium text-sm sm:text-base">
                        ₹{(parseFloat(formData.quantity) * parseFloat(formData.unit_cost) * (parseFloat(formData.gst_rate) / 100)).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs sm:text-sm">Total</div>
                      <div className="font-bold text-sm sm:text-base">
                        ₹{(parseFloat(formData.quantity) * parseFloat(formData.unit_cost) * (1 + parseFloat(formData.gst_rate) / 100)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => { resetForm(); setDialogOpen(false); }}>Cancel</Button>
              <Button className="w-full sm:w-auto" onClick={handleSubmit}>Create Purchase</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Vendor Dialog */}
        <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Vendor</DialogTitle>
              <DialogDescription>
                No existing vendor found with GST: {newVendorData?.vendor_gst_number || 'N/A'}. 
                Would you like to create a new vendor?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Vendor Name *</Label>
                <Input
                  value={newVendorData?.vendor_name || ''}
                  onChange={(e) => setNewVendorData(prev => prev ? { ...prev, vendor_name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>GST Number</Label>
                <Input
                  value={newVendorData?.vendor_gst_number || ''}
                  onChange={(e) => setNewVendorData(prev => prev ? { ...prev, vendor_gst_number: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>Contact Person</Label>
                <Input
                  value={newVendorData?.vendor_contact_person || ''}
                  onChange={(e) => setNewVendorData(prev => prev ? { ...prev, vendor_contact_person: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newVendorData?.vendor_phone || ''}
                  onChange={(e) => setNewVendorData(prev => prev ? { ...prev, vendor_phone: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={newVendorData?.vendor_email || ''}
                  onChange={(e) => setNewVendorData(prev => prev ? { ...prev, vendor_email: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={newVendorData?.vendor_address || ''}
                  onChange={(e) => setNewVendorData(prev => prev ? { ...prev, vendor_address: e.target.value } : null)}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowVendorDialog(false); setNewVendorData(null); }}>
                Skip
              </Button>
              <Button onClick={handleCreateVendor}>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Vendor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ShopAdminLayout>
  );
}
