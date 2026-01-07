import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Check, Package } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface LowStockAlert {
  id: string;
  product_id: string;
  current_stock: number;
  minimum_level: number;
  alert_type: string;
  is_acknowledged: boolean;
  created_at: string;
  product?: { name: string; sku: string | null; reorder_quantity: number };
}

export default function ShopAdminLowStockAlerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  useEffect(() => {
    fetchAlerts();
    generateAlerts();
  }, [showAcknowledged]);

  const generateAlerts = async () => {
    // Fetch products that need alerts
    const { data: products } = await supabase
      .from('shop_products')
      .select('id, stock_quantity, reserved_stock, minimum_stock_level')
      .is('deleted_at', null);

    if (!products) return;

    for (const p of products) {
      const available = (p.stock_quantity || 0) - (p.reserved_stock || 0);
      const minLevel = p.minimum_stock_level || 5;
      
      if (available <= minLevel) {
        const alertType = available <= 0 ? 'out_of_stock' : 'low_stock';
        
        // Check if alert already exists
        const { data: existing } = await supabase
          .from('low_stock_alerts')
          .select('id')
          .eq('product_id', p.id)
          .eq('is_acknowledged', false)
          .maybeSingle();

        if (!existing) {
          await supabase.from('low_stock_alerts').insert({
            product_id: p.id,
            current_stock: available,
            minimum_level: minLevel,
            alert_type: alertType,
          });
        }
      }
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    let query = supabase
      .from('low_stock_alerts')
      .select(`
        *,
        shop_products(name, sku, reorder_quantity)
      `)
      .order('created_at', { ascending: false });

    if (!showAcknowledged) {
      query = query.eq('is_acknowledged', false);
    }

    const { data, error } = await query;

    if (error) {
      toast({ title: 'Error fetching alerts', variant: 'destructive' });
    } else if (data) {
      const mapped = data.map((a: any) => ({
        ...a,
        product: a.shop_products,
      }));
      setAlerts(mapped);
    }
    setLoading(false);
  };

  const acknowledgeAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('low_stock_alerts')
      .update({
        is_acknowledged: true,
        acknowledged_at: new Date().toISOString(),
      })
      .eq('id', alertId);

    if (error) {
      toast({ title: 'Error acknowledging alert', variant: 'destructive' });
    } else {
      toast({ title: 'Alert acknowledged' });
      fetchAlerts();
    }
  };

  const acknowledgeAll = async () => {
    const { error } = await supabase
      .from('low_stock_alerts')
      .update({
        is_acknowledged: true,
        acknowledged_at: new Date().toISOString(),
      })
      .eq('is_acknowledged', false);

    if (error) {
      toast({ title: 'Error acknowledging alerts', variant: 'destructive' });
    } else {
      toast({ title: 'All alerts acknowledged' });
      fetchAlerts();
    }
  };

  const getAlertBadge = (type: string) => {
    if (type === 'out_of_stock') {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Low Stock</Badge>;
  };

  const unacknowledgedCount = alerts.filter(a => !a.is_acknowledged).length;

  return (
    <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/shop/admin/inventory')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Low Stock Alerts
              {unacknowledgedCount > 0 && (
                <Badge variant="destructive">{unacknowledgedCount}</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">Products that need restocking</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAcknowledged(!showAcknowledged)}
            >
              {showAcknowledged ? 'Hide Acknowledged' : 'Show All'}
            </Button>
            {unacknowledgedCount > 0 && (
              <Button variant="outline" onClick={acknowledgeAll}>
                <Check className="mr-2 h-4 w-4" />
                Acknowledge All
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {alerts.filter(a => a.alert_type === 'out_of_stock' && !a.is_acknowledged).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Package className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {alerts.filter(a => a.alert_type === 'low_stock' && !a.is_acknowledged).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Alert Type</TableHead>
                  <TableHead className="text-center">Current Stock</TableHead>
                  <TableHead className="text-center">Minimum Level</TableHead>
                  <TableHead className="text-center">Reorder Qty</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : alerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No alerts found
                    </TableCell>
                  </TableRow>
                ) : (
                  alerts.map((alert) => (
                    <TableRow key={alert.id} className={alert.is_acknowledged ? 'opacity-50' : ''}>
                      <TableCell>
                        <div className="font-medium">{alert.product?.name}</div>
                        <div className="text-xs text-muted-foreground">{alert.product?.sku}</div>
                      </TableCell>
                      <TableCell>{getAlertBadge(alert.alert_type)}</TableCell>
                      <TableCell className="text-center font-medium">{alert.current_stock}</TableCell>
                      <TableCell className="text-center">{alert.minimum_level}</TableCell>
                      <TableCell className="text-center">{alert.product?.reorder_quantity || 10}</TableCell>
                      <TableCell>
                        <div className="text-sm">{format(new Date(alert.created_at), 'MMM dd, yyyy')}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(alert.created_at), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {alert.is_acknowledged ? (
                          <Badge variant="secondary">Acknowledged</Badge>
                        ) : (
                          <Badge variant="destructive">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {!alert.is_acknowledged && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Acknowledge
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/shop/admin/products/${alert.product_id}`)}
                          >
                            View Product
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
}