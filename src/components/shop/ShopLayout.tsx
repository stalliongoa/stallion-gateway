import { ReactNode } from 'react';
import { ShopHeader } from './ShopHeader';
import { ShopFooter } from './ShopFooter';
import { ShopAuthProvider } from '@/hooks/use-shop-auth';
import { CartProvider } from '@/hooks/use-cart';

interface ShopLayoutProps {
  children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <ShopAuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <ShopHeader />
          <main className="flex-1">
            {children}
          </main>
          <ShopFooter />
        </div>
      </CartProvider>
    </ShopAuthProvider>
  );
}
