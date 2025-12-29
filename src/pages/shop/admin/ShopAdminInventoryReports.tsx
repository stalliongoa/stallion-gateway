import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Package, TrendingDown, Truck, History, FileSpreadsheet } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

type DateRange = 'today' | 'week' | 'month' | 'custom';

export default function ShopAdminInventoryReports() {
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  const getDateFilters = () => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return { start: format(now, 'yyyy-MM-dd'), end: format(now, 'yyyy-MM-dd') };
      case 'week':
        return { start: format(subDays(now, 7), 'yyyy-MM-dd'), end: format(now, 'yyyy-MM-dd') };
      case 'month':
        return { start: format(startOfMonth(now), 'yyyy-MM-dd'), end: format(endOfMonth(now), 'yyyy-MM-dd') };
      case 'custom':
        return { start: startDate, end: endDate };
      default:
        return { start: format(startOfMonth(now), 'yyyy-MM-dd'), end: format(endOfMonth(now), 'yyyy-MM-dd') };
    }
  };

  // Stock Summary Report
  const { data: stockSummary, isLoading: loadingStock } = useQuery({
    queryKey: ['stock-summary-report'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_products')
        .select(`
          id,
          name,
          sku,
          stock_quantity,
          reserved_stock,
          minimum_stock_level,
          selling_price,
          cost_price,
          category:shop_categories(name),
          brand:shop_brands(name)
        `)
        .is('deleted_at', null)
        .order('stock_quantity', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Low Stock Report
  const { data: lowStockItems, isLoading: loadingLowStock } = useQuery({
    queryKey: ['low-stock-export-report'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_products')
        .select(`
          id,
          name,
          sku,
          stock_quantity,
          reserved_stock,
          minimum_stock_level,
          reorder_quantity,
          category:shop_categories(name),
          brand:shop_brands(name),
          vendor:shop_vendors(name)
        `)
        .is('deleted_at', null)
        .order('stock_quantity', { ascending: true });
      
      if (error) throw error;
      
      return data?.filter(p => 
        (p.stock_quantity || 0) - (p.reserved_stock || 0) <= (p.minimum_stock_level || 5)
      );
    }
  });

  // Vendor Stock Report
  const { data: vendorStock, isLoading: loadingVendorStock } = useQuery({
    queryKey: ['vendor-stock-export-report'],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from('shop_products')
        .select(`
          id,
          name,
          sku,
          stock_quantity,
          selling_price,
          vendor:shop_vendors(id, name)
        `)
        .is('deleted_at', null)
        .not('vendor_id', 'is', null);
      
      if (error) throw error;
      
      const vendorMap = new Map<string, { vendor: string; products: number; totalStock: number; totalValue: number }>();
      
      products?.forEach(p => {
        const vendorName = p.vendor?.name || 'Unknown';
        const vendorId = p.vendor?.id || 'unknown';
        const existing = vendorMap.get(vendorId) || { vendor: vendorName, products: 0, totalStock: 0, totalValue: 0 };
        existing.products += 1;
        existing.totalStock += p.stock_quantity || 0;
        existing.totalValue += (p.stock_quantity || 0) * (p.selling_price || 0);
        vendorMap.set(vendorId, existing);
      });
      
      return Array.from(vendorMap.values());
    }
  });

  // Purchase History Report
  const { data: purchaseHistory, isLoading: loadingPurchases } = useQuery({
    queryKey: ['purchase-history-export', dateRange, startDate, endDate],
    queryFn: async () => {
      const dates = getDateFilters();
      const { data, error } = await supabase
        .from('shop_purchases')
        .select(`
          id,
          purchase_number,
          purchase_date,
          invoice_number,
          quantity,
          unit_cost,
          total_cost,
          gst_amount,
          payment_status,
          product:shop_products(name, sku),
          vendor:shop_vendors(name)
        `)
        .gte('purchase_date', dates.start)
        .lte('purchase_date', dates.end)
        .order('purchase_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Stock Movement Report
  const { data: stockMovements, isLoading: loadingMovements } = useQuery({
    queryKey: ['stock-movement-export-report', dateRange, startDate, endDate],
    queryFn: async () => {
      const dates = getDateFilters();
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          id,
          action_type,
          quantity_change,
          quantity_before,
          quantity_after,
          reason,
          created_at,
          product:shop_products(name, sku)
        `)
        .gte('created_at', `${dates.start}T00:00:00`)
        .lte('created_at', `${dates.end}T23:59:59`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const exportToCSV = (data: any[], filename: string, headers: string[], keys: string[]) => {
    if (!data?.length) return;
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => keys.map(key => {
        let value = key.split('.').reduce((obj, k) => obj?.[k], row);
        if (typeof value === 'object' && value !== null) {
          value = value.name || JSON.stringify(value);
        }
        return `"${String(value ?? '').replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  const exportStockSummary = () => {
    if (!stockSummary) return;
    const exportData = stockSummary.map(p => ({
      sku: p.sku,
      name: p.name,
      category: p.category?.name,
      brand: p.brand?.name,
      stock_quantity: p.stock_quantity,
      reserved_stock: p.reserved_stock,
      available_stock: (p.stock_quantity || 0) - (p.reserved_stock || 0),
      min_stock: p.minimum_stock_level,
      selling_price: p.selling_price,
      stock_value: (p.stock_quantity || 0) * (p.selling_price || 0)
    }));
    exportToCSV(
      exportData, 
      'stock_summary', 
      ['SKU', 'Name', 'Category', 'Brand', 'Stock Qty', 'Reserved', 'Available', 'Min Stock', 'Price', 'Value'],
      ['sku', 'name', 'category', 'brand', 'stock_quantity', 'reserved_stock', 'available_stock', 'min_stock', 'selling_price', 'stock_value']
    );
  };

  const exportLowStock = () => {
    if (!lowStockItems) return;
    const exportData = lowStockItems.map(p => ({
      sku: p.sku,
      name: p.name,
      category: p.category?.name,
      vendor: p.vendor?.name,
      current_stock: p.stock_quantity,
      reserved: p.reserved_stock,
      available: (p.stock_quantity || 0) - (p.reserved_stock || 0),
      minimum_level: p.minimum_stock_level,
      reorder_qty: p.reorder_quantity
    }));
    exportToCSV(
      exportData, 
      'low_stock_report', 
      ['SKU', 'Name', 'Category', 'Vendor', 'Current Stock', 'Reserved', 'Available', 'Min Level', 'Reorder Qty'],
      ['sku', 'name', 'category', 'vendor', 'current_stock', 'reserved', 'available', 'minimum_level', 'reorder_qty']
    );
  };

  const exportPurchaseHistory = () => {
    if (!purchaseHistory) return;
    const exportData = purchaseHistory.map(p => ({
      purchase_number: p.purchase_number,
      date: p.purchase_date,
      vendor: p.vendor?.name,
      product: p.product?.name,
      sku: p.product?.sku,
      quantity: p.quantity,
      unit_cost: p.unit_cost,
      gst: p.gst_amount,
      total: p.total_cost,
      payment_status: p.payment_status
    }));
    exportToCSV(
      exportData, 
      'purchase_history', 
      ['Purchase #', 'Date', 'Vendor', 'Product', 'SKU', 'Qty', 'Unit Cost', 'GST', 'Total', 'Status'],
      ['purchase_number', 'date', 'vendor', 'product', 'sku', 'quantity', 'unit_cost', 'gst', 'total', 'payment_status']
    );
  };

  const exportStockMovements = () => {
    if (!stockMovements) return;
    const exportData = stockMovements.map(m => ({
      date: format(new Date(m.created_at), 'yyyy-MM-dd HH:mm'),
      product: m.product?.name,
      sku: m.product?.sku,
      action_type: m.action_type,
      quantity_change: m.quantity_change,
      before: m.quantity_before,
      after: m.quantity_after,
      reason: m.reason
    }));
    exportToCSV(
      exportData, 
      'stock_movements', 
      ['Date', 'Product', 'SKU', 'Action', 'Change', 'Before', 'After', 'Reason'],
      ['date', 'product', 'sku', 'action_type', 'quantity_change', 'before', 'after', 'reason']
    );
  };

  // Summary stats
  const totalStockValue = stockSummary?.reduce((sum, p) => sum + ((p.stock_quantity || 0) * (p.selling_price || 0)), 0) || 0;
  const totalProducts = stockSummary?.length || 0;
  const lowStockCount = lowStockItems?.length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Reports</h1>
          <p className="text-muted-foreground">Generate and export detailed inventory reports</p>
        </div>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Export to CSV</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Value</p>
                <p className="text-2xl font-bold">₹{totalStockValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>Date Range (for Purchases & Movements)</Label>
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {dateRange === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stock-summary" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="stock-summary" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Stock</span>
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            <span className="hidden sm:inline">Low Stock</span>
          </TabsTrigger>
          <TabsTrigger value="vendor-stock" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Vendors</span>
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Purchases</span>
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Movements</span>
          </TabsTrigger>
        </TabsList>

        {/* Stock Summary Tab */}
        <TabsContent value="stock-summary">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stock Summary Report</CardTitle>
                <CardDescription>Complete inventory levels overview</CardDescription>
              </div>
              <Button onClick={exportStockSummary} disabled={!stockSummary?.length}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {loadingStock ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Reserved</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockSummary?.slice(0, 50).map((product) => {
                        const available = (product.stock_quantity || 0) - (product.reserved_stock || 0);
                        const value = (product.stock_quantity || 0) * (product.selling_price || 0);
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-mono text-sm">{product.sku || '-'}</TableCell>
                            <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                            <TableCell>{product.category?.name || '-'}</TableCell>
                            <TableCell className="text-right">{product.stock_quantity || 0}</TableCell>
                            <TableCell className="text-right">{product.reserved_stock || 0}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={available <= (product.minimum_stock_level || 5) ? 'destructive' : 'default'}>
                                {available}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">₹{value.toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {(stockSummary?.length || 0) > 50 && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Showing first 50 of {stockSummary?.length} products. Export for full report.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Low Stock Report</CardTitle>
                <CardDescription>Products below minimum stock level requiring reorder</CardDescription>
              </div>
              <Button onClick={exportLowStock} disabled={!lowStockItems?.length}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {loadingLowStock ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : lowStockItems?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  All products are above minimum stock levels
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead className="text-right">Min Level</TableHead>
                      <TableHead className="text-right">Reorder Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems?.map((product) => {
                      const available = (product.stock_quantity || 0) - (product.reserved_stock || 0);
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-mono text-sm">{product.sku || '-'}</TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                          <TableCell>{product.vendor?.name || '-'}</TableCell>
                          <TableCell className="text-right">{product.stock_quantity || 0}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={available <= 0 ? 'destructive' : 'secondary'}>
                              {available}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{product.minimum_stock_level || 5}</TableCell>
                          <TableCell className="text-right">{product.reorder_quantity || 10}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Stock Tab */}
        <TabsContent value="vendor-stock">
          <Card>
            <CardHeader>
              <CardTitle>Vendor-wise Stock Report</CardTitle>
              <CardDescription>Stock grouped by vendor/supplier</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingVendorStock ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : vendorStock?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No products with assigned vendors
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-right">Products</TableHead>
                      <TableHead className="text-right">Total Stock</TableHead>
                      <TableHead className="text-right">Stock Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorStock?.map((vendor, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{vendor.vendor}</TableCell>
                        <TableCell className="text-right">{vendor.products}</TableCell>
                        <TableCell className="text-right">{vendor.totalStock}</TableCell>
                        <TableCell className="text-right">₹{vendor.totalValue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase History Tab */}
        <TabsContent value="purchases">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Purchase History Report</CardTitle>
                <CardDescription>All purchases within selected date range</CardDescription>
              </div>
              <Button onClick={exportPurchaseHistory} disabled={!purchaseHistory?.length}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {loadingPurchases ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : purchaseHistory?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No purchases found in selected date range
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Purchase #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseHistory?.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono text-sm">{purchase.purchase_number}</TableCell>
                        <TableCell>{purchase.purchase_date}</TableCell>
                        <TableCell>{purchase.vendor?.name || '-'}</TableCell>
                        <TableCell className="font-medium max-w-[150px] truncate">{purchase.product?.name}</TableCell>
                        <TableCell className="text-right">{purchase.quantity}</TableCell>
                        <TableCell className="text-right">₹{purchase.total_cost?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={purchase.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {purchase.payment_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Movements Tab */}
        <TabsContent value="movements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stock Movement Report</CardTitle>
                <CardDescription>All stock changes within selected date range</CardDescription>
              </div>
              <Button onClick={exportStockMovements} disabled={!stockMovements?.length}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {loadingMovements ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : stockMovements?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No stock movements found in selected date range
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Before</TableHead>
                      <TableHead className="text-right">After</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements?.slice(0, 100).map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{format(new Date(movement.created_at), 'MMM dd, HH:mm')}</TableCell>
                        <TableCell className="font-medium max-w-[150px] truncate">{movement.product?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{movement.action_type}</Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${movement.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {movement.quantity_change > 0 ? '+' : ''}{movement.quantity_change}
                        </TableCell>
                        <TableCell className="text-right">{movement.quantity_before}</TableCell>
                        <TableCell className="text-right">{movement.quantity_after}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[150px] truncate">{movement.reason || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
