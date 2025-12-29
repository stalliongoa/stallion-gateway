import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Search, Filter } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface StockMovement {
  id: string;
  product_id: string;
  action_type: string;
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reference_type: string | null;
  reference_id: string | null;
  reason: string | null;
  notes: string | null;
  created_at: string;
  product?: { name: string; sku: string | null };
}

export default function ShopAdminStockMovements() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [productName, setProductName] = useState('');

  useEffect(() => {
    fetchMovements();
    if (productId) {
      fetchProductName();
    }
  }, [productId]);

  const fetchProductName = async () => {
    if (!productId) return;
    const { data } = await supabase
      .from('shop_products')
      .select('name')
      .eq('id', productId)
      .single();
    if (data) setProductName(data.name);
  };

  const fetchMovements = async () => {
    setLoading(true);
    let query = supabase
      .from('stock_movements')
      .select(`
        *,
        shop_products(name, sku)
      `)
      .order('created_at', { ascending: false })
      .limit(500);

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) {
      toast({ title: 'Error fetching movements', variant: 'destructive' });
    } else if (data) {
      const mapped = data.map((m: any) => ({
        ...m,
        product: m.shop_products,
      }));
      setMovements(mapped);
    }
    setLoading(false);
  };

  const getActionBadge = (type: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      purchase: { label: 'Purchase', className: 'bg-green-500/20 text-green-600' },
      sale: { label: 'Sale', className: 'bg-blue-500/20 text-blue-600' },
      quotation_reserved: { label: 'Reserved', className: 'bg-yellow-500/20 text-yellow-600' },
      quotation_released: { label: 'Released', className: 'bg-purple-500/20 text-purple-600' },
      adjustment: { label: 'Adjustment', className: 'bg-orange-500/20 text-orange-600' },
      transfer: { label: 'Transfer', className: 'bg-cyan-500/20 text-cyan-600' },
      return: { label: 'Return', className: 'bg-pink-500/20 text-pink-600' },
    };
    const badge = badges[type] || { label: type, className: '' };
    return <Badge variant="secondary" className={badge.className}>{badge.label}</Badge>;
  };

  const filteredMovements = movements.filter(m => {
    const matchesSearch = 
      (m.product?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.product?.sku || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.reason || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || m.action_type === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Product', 'SKU', 'Action', 'Change', 'Before', 'After', 'Reason', 'Notes'];
    const rows = filteredMovements.map(m => [
      format(new Date(m.created_at), 'yyyy-MM-dd HH:mm'),
      m.product?.name || '',
      m.product?.sku || '',
      m.action_type,
      m.quantity_change,
      m.quantity_before,
      m.quantity_after,
      m.reason || '',
      m.notes || '',
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-movements-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <ShopAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              Stock Movement Log
              {productName && <span className="text-muted-foreground font-normal"> - {productName}</span>}
            </h1>
            <p className="text-muted-foreground">Complete audit trail of all stock changes</p>
          </div>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product, SKU, or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="quotation_reserved">Reserved</SelectItem>
              <SelectItem value="quotation_released">Released</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="return">Return</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Movements Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  {!productId && <TableHead>Product</TableHead>}
                  <TableHead>Action</TableHead>
                  <TableHead className="text-center">Change</TableHead>
                  <TableHead className="text-center">Before</TableHead>
                  <TableHead className="text-center">After</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={productId ? 7 : 8} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={productId ? 7 : 8} className="text-center py-8 text-muted-foreground">
                      No stock movements found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div className="text-sm">{format(new Date(movement.created_at), 'MMM dd, yyyy')}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(movement.created_at), 'HH:mm:ss')}
                        </div>
                      </TableCell>
                      {!productId && (
                        <TableCell>
                          <div className="font-medium">{movement.product?.name}</div>
                          <div className="text-xs text-muted-foreground">{movement.product?.sku}</div>
                        </TableCell>
                      )}
                      <TableCell>{getActionBadge(movement.action_type)}</TableCell>
                      <TableCell className="text-center">
                        <span className={movement.quantity_change > 0 ? 'text-green-600' : 'text-destructive'}>
                          {movement.quantity_change > 0 ? '+' : ''}{movement.quantity_change}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{movement.quantity_before}</TableCell>
                      <TableCell className="text-center font-medium">{movement.quantity_after}</TableCell>
                      <TableCell className="capitalize">{movement.reason?.replace('_', ' ') || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{movement.notes || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ShopAdminLayout>
  );
}