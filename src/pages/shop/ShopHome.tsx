import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, HeadphonesIcon, BadgePercent } from 'lucide-react';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category } from '@/types/shop';

export default function ShopHome() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch featured products
    const { data: products } = await supabase
      .from('shop_products')
      .select(`
        *,
        category:shop_categories(*),
        brand:shop_brands(*)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(8);

    // Fetch categories
    const { data: cats } = await supabase
      .from('shop_categories')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)
      .order('display_order');

    if (products) setFeaturedProducts(products as unknown as Product[]);
    if (cats) setCategories(cats as unknown as Category[]);
    
    setIsLoading(false);
  };

  const features = [
    {
      icon: Shield,
      title: 'Genuine Products',
      description: 'All products are 100% authentic with warranty'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick delivery across Goa and Pan-India shipping'
    },
    {
      icon: HeadphonesIcon,
      title: 'Expert Support',
      description: '24/7 technical support and installation services'
    },
    {
      icon: BadgePercent,
      title: 'Best Prices',
      description: 'Competitive B2B and B2C pricing'
    }
  ];

  return (
    <ShopLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-stallion-navy to-stallion-navy/90 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Trusted Partner for{' '}
              <span className="text-stallion-gold">Enterprise Electronics</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              From CCTV systems to servers, networking equipment to computers — 
              we provide enterprise-grade electronics with expert support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop/products">
                <Button size="lg" className="bg-stallion-gold hover:bg-stallion-gold/90 text-stallion-navy font-semibold">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-stallion-navy">
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-stallion-gold/10 flex items-center justify-center mb-3">
                  <feature.icon className="h-6 w-6 text-stallion-gold" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <Link to="/shop/products" className="text-stallion-gold hover:underline text-sm font-medium">
              View All Categories
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/shop/category/${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-stallion-navy/5 flex items-center justify-center group-hover:bg-stallion-gold/10 transition-colors">
                      <Shield className="h-8 w-8 text-stallion-navy group-hover:text-stallion-gold transition-colors" />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link to="/shop/products" className="text-stallion-gold hover:underline text-sm font-medium">
              View All Products
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured products yet. Check back soon!</p>
              <Link to="/shop/products">
                <Button className="mt-4">Browse All Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-stallion-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We provide complete IT infrastructure solutions for businesses of all sizes. 
            From CCTV installations to server setups, our experts are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-stallion-gold hover:bg-stallion-gold/90 text-stallion-navy">
                Request a Quote
              </Button>
            </Link>
            <a href="tel:+918322513159">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-stallion-navy">
                Call: +91 832 251 3159
              </Button>
            </a>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
