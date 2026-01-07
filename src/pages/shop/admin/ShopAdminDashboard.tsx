import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function ShopAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    // Fetch product counts
    const { count: totalProducts } = await supabase
      .from('shop_products')
      .select('*', { count: 'exact', head: true });

    const { count: activeProducts } = await supabase
      .from('shop_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { data: lowStock } = await supabase
      .from('shop_products')
      .select('id, name, stock_quantity, low_stock_threshold')
      .eq('is_active', true)
      .filter('stock_quantity', 'lte', 'low_stock_threshold')
      .order('stock_quantity', { ascending: true })
      .limit(5);

    // Fetch order stats
    const { count: totalOrders } = await supabase
      .from('shop_orders')
      .select('*', { count: 'exact', head: true });

    const { count: pendingOrders } = await supabase
      .from('shop_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { data: orders } = await supabase
      .from('shop_orders')
      .select('id, order_number, total_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Calculate total revenue from completed orders
    const { data: revenueData } = await supabase
      .from('shop_orders')
      .select('total_amount')
      .in('status', ['completed', 'delivered']);

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    // Fetch customer count
    const { count: totalCustomers } = await supabase
      .from('shop_customers')
      .select('*', { count: 'exact', head: true });

    setStats({
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      lowStockProducts: lowStock?.length || 0,
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      totalCustomers: totalCustomers || 0,
      totalRevenue,
    });

    setRecentOrders(orders || []);
    setLowStockItems(lowStock || []);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      subtitle: `${stats.activeProducts} active`,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      color: 'text-shop-orange',
      bg: 'bg-orange-100',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      subtitle: 'Registered users',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      subtitle: 'From completed orders',
      icon: IndianRupee,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
  ];

  return (
    <div className="p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome to Shoppie Admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{stat.title}</p>
                    <p className="text-lg md:text-2xl font-bold mt-1 truncate">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{stat.subtitle}</p>
                  </div>
                  <div className={cn(stat.bg, 'p-2 md:p-3 rounded-full flex-shrink-0 ml-2')}>
                    <stat.icon className={cn('h-4 w-4 md:h-6 md:w-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Link to="/shop/admin/orders">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.total_amount.toLocaleString('en-IN')}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Low Stock Alert
              </CardTitle>
              <Link to="/shop/admin/products">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="space-y-4">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Threshold: {item.low_stock_threshold}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {item.stock_quantity} left
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">All products well stocked</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop/admin/products/new">
                <Button className="bg-shop-orange hover:bg-shop-orange-dark">
                  <Package className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
              <Link to="/shop/admin/categories">
                <Button variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </Link>
              <Link to="/shop/admin/orders">
                <Button variant="outline">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}