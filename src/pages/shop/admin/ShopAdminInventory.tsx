import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, TrendingDown, ArrowUpDown, Search, Filter, Eye, Edit, History, Barcode } from 'lucide-react';
import { BarcodeScanner } from '@/components/admin/BarcodeScanner';
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

interface InventoryProduct {
  id: string;
  name: string;
  sku: string | null;
  model_number: string | null;
  category_id: string | null;
  brand_id: string | null;
  vendor_id: string | null;
  stock_quantity: number;
  reserved_stock: number;
  minimum_stock_level: number;
  reorder_quantity: number;
  purchase_price: number | null;
  selling_price: number | null;
  tax_rate: number;
  is_active: boolean;
  category?: { name: string };
  brand?: { name: string };
  vendor?: { name: string };
}

export default function ShopAdminInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [adjustmentDialog, setAdjustmentDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const [enableSerialTracking, setEnableSerialTracking] = useState(false);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('shop_categories')
      .select('id, name')
      .eq('is_active', true)
      .order('name');
    if (data) setCategories(data);
  };

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shop_products')
      .select(`
        id, name, sku, model_number, category_id, brand_id, vendor_id,
        stock_quantity, reserved_stock, minimum_stock_level, reorder_quantity,
        purchase_price, selling_price, tax_rate, is_active,
        shop_categories(name),
        shop_brands(name),
        shop_vendors(name)
      `)
      .is('deleted_at', null)
      .order('name');

    if (error) {
      toast({ title: 'Error fetching inventory', variant: 'destructive' });
    } else if (data) {
      const mapped = data.map((p: any) => ({
        ...p,
        category: p.shop_categories,
        brand: p.shop_brands,
        vendor: p.shop_vendors,
      }));
      setProducts(mapped);
      
      // Calculate stats
      const lowStock = mapped.filter((p: any) => {
        const available = (p.stock_quantity || 0) - (p.reserved_stock || 0);
        return available > 0 && available <= (p.minimum_stock_level || 5);
      }).length;
      
      const outOfStock = mapped.filter((p: any) => {
        const available = (p.stock_quantity || 0) - (p.reserved_stock || 0);
        return available <= 0;
      }).length;
      
      const totalValue = mapped.reduce((sum: number, p: any) => {
        return sum + ((p.purchase_price || 0) * (p.stock_quantity || 0));
      }, 0);
      
      setStats({
        totalProducts: mapped.length,
        lowStock,
        outOfStock,
        totalValue,
      });
    }
    setLoading(false);
  };

  const openAdjustmentDialog = (product: InventoryProduct) => {
    setSelectedProduct(product);
    setAdjustmentType('add');
    setAdjustmentQty('');
    setAdjustmentReason('');
    setAdjustmentNotes('');
    setSerialNumbers([]);
    setEnableSerialTracking(false);
    setAdjustmentDialog(true);
  };

  const handleAdjustment = async () => {
    if (!selectedProduct || !adjustmentQty || !adjustmentReason) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const qty = parseInt(adjustmentQty);
    if (isNaN(qty) || qty <= 0) {
      toast({ title: 'Invalid quantity', variant: 'destructive' });
      return;
    }

    const quantityChange = adjustmentType === 'add' ? qty : -qty;
    const newStock = (selectedProduct.stock_quantity || 0) + quantityChange;

    if (newStock < 0) {
      toast({ title: 'Cannot reduce stock below zero', variant: 'destructive' });
      return;
    }

    // Update product stock
    const { error: updateError } = await supabase
      .from('shop_products')
      .update({ stock_quantity: newStock })
      .eq('id', selectedProduct.id);

    if (updateError) {
      toast({ title: 'Error updating stock', description: updateError.message, variant: 'destructive' });
      return;
    }

    // Build notes with serial numbers if tracked
    const notesWithSerials = enableSerialTracking && serialNumbers.length > 0
      ? `${adjustmentNotes}\n\nSerial Numbers:\n${serialNumbers.join('\n')}`
      : adjustmentNotes;

    // Log stock movement
    const { error: logError } = await supabase
      .from('stock_movements')
      .insert({
        product_id: selectedProduct.id,
        action_type: 'adjustment',
        quantity_change: quantityChange,
        quantity_before: selectedProduct.stock_quantity || 0,
        quantity_after: newStock,
        reference_type: 'adjustment',
        reason: adjustmentReason,
        notes: notesWithSerials,
      });

    if (logError) {
      console.error('Error logging movement:', logError);
    }

    // Log adjustment with serial numbers
    await supabase.from('stock_adjustments').insert({
      product_id: selectedProduct.id,
      adjustment_type: adjustmentType,
      quantity: qty,
      reason: adjustmentReason,
      notes: notesWithSerials,
    });

    toast({ title: 'Stock adjusted successfully' });
    setAdjustmentDialog(false);
    fetchInventory();
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.model_number || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
    
    const available = (p.stock_quantity || 0) - (p.reserved_stock || 0);
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = available > 0 && available <= (p.minimum_stock_level || 5);
    } else if (stockFilter === 'out') {
      matchesStock = available <= 0;
    } else if (stockFilter === 'in') {
      matchesStock = available > (p.minimum_stock_level || 5);
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (product: InventoryProduct) => {
    const available = (product.stock_quantity || 0) - (product.reserved_stock || 0);
    if (available <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (available <= (product.minimum_stock_level || 5)) {
      return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Low Stock</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-500/20 text-green-600">In Stock</Badge>;
  };

  return (
    <ShopAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage product stock levels</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/shop/admin/inventory/movements')}>
              <History className="mr-2 h-4 w-4" />
              Stock Movements
            </Button>
            <Button variant="outline" onClick={() => navigate('/shop/admin/inventory/alerts')}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Low Stock Alerts
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.outOfStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock Levels</SelectItem>
              <SelectItem value="in">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU / Model</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Current Stock</TableHead>
                  <TableHead className="text-center">Reserved</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const available = (product.stock_quantity || 0) - (product.reserved_stock || 0);
                    const value = (product.purchase_price || 0) * (product.stock_quantity || 0);
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.brand?.name || 'No brand'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{product.sku || '-'}</div>
                          <div className="text-xs text-muted-foreground">{product.model_number || '-'}</div>
                        </TableCell>
                        <TableCell>{product.category?.name || '-'}</TableCell>
                        <TableCell className="text-center font-medium">{product.stock_quantity || 0}</TableCell>
                        <TableCell className="text-center">{product.reserved_stock || 0}</TableCell>
                        <TableCell className="text-center font-medium">{available}</TableCell>
                        <TableCell>{getStockStatus(product)}</TableCell>
                        <TableCell className="text-right">₹{value.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/shop/admin/inventory/history/${product.id}`)}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openAdjustmentDialog(product)}
                            >
                              <ArrowUpDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/shop/admin/products/${product.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stock Adjustment Dialog */}
        <Dialog open={adjustmentDialog} onOpenChange={setAdjustmentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adjust Stock - {selectedProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-xs text-muted-foreground">Current Stock</div>
                  <div className="text-lg font-bold">{selectedProduct?.stock_quantity || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Reserved</div>
                  <div className="text-lg font-bold">{selectedProduct?.reserved_stock || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Available</div>
                  <div className="text-lg font-bold">
                    {(selectedProduct?.stock_quantity || 0) - (selectedProduct?.reserved_stock || 0)}
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Adjustment Type *</Label>
                <Select value={adjustmentType} onValueChange={(v: 'add' | 'remove') => setAdjustmentType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock (+)</SelectItem>
                    <SelectItem value="remove">Remove Stock (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  min="1"
                  value={adjustmentQty}
                  onChange={(e) => {
                    setAdjustmentQty(e.target.value);
                    // Reset serial numbers if quantity changes
                    if (enableSerialTracking) {
                      setSerialNumbers([]);
                    }
                  }}
                  placeholder="Enter quantity"
                />
              </div>
              
              {/* Serial Number Tracking Toggle - Only for adding stock */}
              {adjustmentType === 'add' && parseInt(adjustmentQty) > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enableSerialTracking"
                      checked={enableSerialTracking}
                      onChange={(e) => {
                        setEnableSerialTracking(e.target.checked);
                        if (!e.target.checked) {
                          setSerialNumbers([]);
                        }
                      }}
                      className="h-4 w-4 rounded border-input"
                    />
                    <Label htmlFor="enableSerialTracking" className="cursor-pointer flex items-center gap-2">
                      <Barcode className="h-4 w-4" />
                      Enable Serial Number Tracking
                    </Label>
                  </div>
                  
                  {enableSerialTracking && (
                    <BarcodeScanner
                      quantity={parseInt(adjustmentQty) || 0}
                      serialNumbers={serialNumbers}
                      onSerialNumbersChange={setSerialNumbers}
                    />
                  )}
                </div>
              )}
              
              <div>
                <Label>Reason *</Label>
                <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                    <SelectItem value="correction">Correction</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="found">Found/Recovered</SelectItem>
                    <SelectItem value="initial_stock">Initial Stock</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAdjustmentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdjustment}>
                {adjustmentType === 'add' ? 'Add Stock' : 'Remove Stock'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ShopAdminLayout>
  );
}