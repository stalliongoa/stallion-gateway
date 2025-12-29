import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductFiltersComponent } from '@/components/shop/ProductFilters';
import { ProductSort } from '@/components/shop/ProductSort';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category, ProductFilters, FilterConfig } from '@/types/shop';

export default function ProductList() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState<ProductFilters>({
    category: categorySlug,
    search: searchQuery,
    sortBy: 'newest'
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);

  useEffect(() => {
    if (categorySlug) {
      fetchCategory();
    }
    fetchProducts();
  }, [categorySlug, filters]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchQuery, category: categorySlug }));
  }, [searchQuery, categorySlug]);

  const fetchCategory = async () => {
    const { data } = await supabase
      .from('shop_categories')
      .select('*')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (data) {
      setCategory(data as unknown as Category);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);

    let query = supabase
      .from('shop_products')
      .select(`
        *,
        category:shop_categories(*),
        brand:shop_brands(*)
      `)
      .eq('is_active', true);

    // Category filter
    if (categorySlug && category) {
      query = query.eq('category_id', category.id);
    }

    // Search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    }

    // Brand filter
    if (filters.brand) {
      const { data: brandData } = await supabase
        .from('shop_brands')
        .select('id')
        .eq('slug', filters.brand)
        .maybeSingle();
      
      if (brandData) {
        query = query.eq('brand_id', brandData.id);
      }
    }

    // Price range filter
    if (filters.priceRange) {
      query = query
        .gte('selling_price', filters.priceRange[0])
        .lte('selling_price', filters.priceRange[1]);
    }

    // In stock filter
    if (filters.inStock) {
      query = query.gt('stock_quantity', 0);
    }

    // Specification filters
    if (filters.specifications && Object.keys(filters.specifications).length > 0) {
      Object.entries(filters.specifications).forEach(([key, value]) => {
        query = query.contains('specifications', { [key]: value });
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price_asc':
        query = query.order('selling_price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('selling_price', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts((data || []) as unknown as Product[]);
      
      // Calculate price range from products
      if (data && data.length > 0) {
        const prices = data
          .map(p => Number(p.selling_price || 0))
          .filter(p => p > 0);
        if (prices.length > 0) {
          setPriceRange([0, Math.max(...prices)]);
        }
      }
    }

    setIsLoading(false);
  };

  const categoryFilters: FilterConfig[] = category?.filter_config 
    ? (Array.isArray(category.filter_config) 
        ? category.filter_config 
        : JSON.parse(category.filter_config as unknown as string))
    : [];

  const pageTitle = category?.name || (filters.search ? `Search: "${filters.search}"` : 'All Products');

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2">
            <li><a href="/shop" className="text-muted-foreground hover:text-foreground">Shop</a></li>
            <li className="text-muted-foreground">/</li>
            <li className="font-medium">{pageTitle}</li>
          </ol>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold mb-6">{pageTitle}</h1>

        {category?.description && (
          <p className="text-muted-foreground mb-8">{category.description}</p>
        )}

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFiltersComponent
              categoryFilters={categoryFilters}
              activeFilters={filters}
              onFilterChange={setFilters}
              priceRange={priceRange}
              categorySlug={categorySlug}
            />
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-4">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <ProductFiltersComponent
                      categoryFilters={categoryFilters}
                      activeFilters={filters}
                      onFilterChange={(newFilters) => {
                        setFilters(newFilters);
                        setMobileFiltersOpen(false);
                      }}
                      priceRange={priceRange}
                      categorySlug={categorySlug}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <ProductSort
              activeFilters={filters}
              onFilterChange={setFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalProducts={products.length}
            />

            {isLoading ? (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={() => setFilters({ category: categorySlug, sortBy: 'newest' })}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
