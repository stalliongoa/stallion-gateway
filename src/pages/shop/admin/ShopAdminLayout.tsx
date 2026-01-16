import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  Tags, 
  FolderTree,
  Settings,
  ArrowLeft,
  BarChart3,
  FileText,
  Shield,
  Warehouse,
  PackageSearch,
  AlertTriangle,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShopAuthProvider, useShopAuth } from '@/hooks/use-shop-auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import shoppieLogo from '@/assets/shoppie-logo.png';

interface ShopAdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/shop/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/shop/admin/products', icon: Package, label: 'Products' },
  { href: '/shop/admin/categories', icon: FolderTree, label: 'Categories' },
  { href: '/shop/admin/brands', icon: Tags, label: 'Brands' },
  { href: '/shop/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/shop/admin/invoices', icon: FileText, label: 'Invoices' },
  { href: '/shop/admin/inventory', icon: Warehouse, label: 'Inventory' },
  { href: '/shop/admin/inventory/movements', icon: PackageSearch, label: 'Stock Movements' },
  { href: '/shop/admin/inventory/alerts', icon: AlertTriangle, label: 'Low Stock Alerts' },
  { href: '/shop/admin/inventory/reports', icon: BarChart3, label: 'Inventory Reports' },
  { href: '/shop/admin/purchases', icon: ClipboardList, label: 'Purchases' },
  { href: '/shop/admin/customers', icon: Users, label: 'Customers' },
  { href: '/shop/admin/vendors', icon: Truck, label: 'Vendors' },
  { href: '/shop/admin/reports', icon: BarChart3, label: 'Sales Reports' },
  { href: '/shop/admin/management', icon: Shield, label: 'Admin Access' },
  { href: '/shop/admin/settings', icon: Settings, label: 'Settings' },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const location = useLocation();
  
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <img src={shoppieLogo} alt="Shoppie Admin" className="h-10" />
        <span className="text-sm font-medium text-shop-orange">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/shop/admin' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-shop-orange text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className="border-t border-white/10 p-4">
        <Link to="/shop" onClick={onNavClick}>
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ShopAdminLayoutContent({ children }: ShopAdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useShopAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/shop/auth');
    }
  }, [user, isAdmin, isLoading, navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop-orange"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-shop-navy text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-shop-navy border-shop-navy-light">
              <SidebarContent onNavClick={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <img src={shoppieLogo} alt="Shoppie Admin" className="h-8" />
          <span className="text-sm font-medium text-shop-orange">Admin</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 z-40 h-screen w-64 bg-shop-navy text-white">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

export function ShopAdminLayout({ children }: ShopAdminLayoutProps) {
  return (
    <ShopAuthProvider>
      <ShopAdminLayoutContent>{children}</ShopAdminLayoutContent>
    </ShopAuthProvider>
  );
}
