import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useShopAuth } from '@/hooks/use-shop-auth';
import { useCart } from '@/hooks/use-cart';
import shoppieLogo from '@/assets/shoppie-logo.png';

const categories = [
  { name: 'Computers & Laptops', slug: 'computers-laptops' },
  { name: 'Computer Accessories', slug: 'computer-accessories' },
  { name: 'CCTV & Surveillance', slug: 'cctv-surveillance' },
  { name: 'CCTV Accessories', slug: 'cctv-accessories' },
  { name: 'Networking Devices', slug: 'networking-devices' },
  { name: 'Networking Accessories', slug: 'networking-accessories' },
  { name: 'Passive Networking', slug: 'passive-networking' },
  { name: 'Servers', slug: 'servers' },
  { name: 'Server Accessories', slug: 'server-accessories' },
];

export function ShopHeader() {
  const { user, isAdmin, signOut } = useShopAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-stallion-navy text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>Welcome to Shoppie Stallion - Your Electronics Partner</span>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="hover:text-stallion-gold transition-colors">
              Back to Stallion.co.in
            </Link>
            <span>|</span>
            <a href="tel:+918322513159" className="hover:text-stallion-gold transition-colors">
              +91 832 251 3159
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/shop" className="flex-shrink-0">
            <img src={shoppieLogo} alt="Shoppie Stallion" className="h-12 md:h-16" />
          </Link>

          {/* Search bar - hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pr-12 border-stallion-navy/30 focus:border-stallion-gold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-stallion-gold hover:bg-stallion-gold/90"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart */}
            <Link to="/shop/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-stallion-gold text-stallion-navy text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/shop/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/shop/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/shop/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/shop/admin" className="text-stallion-gold font-medium">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/shop/auth">
                <Button variant="outline" size="sm" className="border-stallion-gold text-stallion-gold hover:bg-stallion-gold hover:text-white">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pr-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-stallion-gold"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Category navigation */}
      <nav className="hidden md:block bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-2">
            <li>
              <Link
                to="/shop/products"
                className="px-3 py-2 text-sm font-medium text-stallion-navy hover:text-stallion-gold transition-colors whitespace-nowrap"
              >
                All Products
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/shop/category/${cat.slug}`}
                  className="px-3 py-2 text-sm font-medium text-stallion-navy hover:text-stallion-gold transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <ul className="py-2">
            <li>
              <Link
                to="/shop/products"
                className="block px-4 py-2 text-sm font-medium text-stallion-navy hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/shop/category/${cat.slug}`}
                  className="block px-4 py-2 text-sm text-stallion-navy hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
