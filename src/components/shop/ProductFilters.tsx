import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FilterConfig, Brand, ProductFilters } from '@/types/shop';
import { supabase } from '@/integrations/supabase/client';

interface ProductFiltersProps {
  categoryFilters: FilterConfig[];
  activeFilters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  priceRange: [number, number];
  categorySlug?: string;
}

export function ProductFiltersComponent({
  categoryFilters,
  activeFilters,
  onFilterChange,
  priceRange,
  categorySlug
}: ProductFiltersProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    activeFilters.priceRange || priceRange
  );

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const { data } = await supabase
      .from('shop_brands')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (data) {
      setBrands(data as Brand[]);
    }
  };

  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    onFilterChange({
      ...activeFilters,
      brand: checked ? brandSlug : undefined
    });
  };

  const handleSpecChange = (key: string, value: string, checked: boolean) => {
    const currentSpecs = activeFilters.specifications || {};
    
    if (checked) {
      onFilterChange({
        ...activeFilters,
        specifications: { ...currentSpecs, [key]: value }
      });
    } else {
      const { [key]: removed, ...rest } = currentSpecs;
      onFilterChange({
        ...activeFilters,
        specifications: rest
      });
    }
  };

  const handlePriceCommit = () => {
    onFilterChange({
      ...activeFilters,
      priceRange: localPriceRange
    });
  };

  const handleStockChange = (checked: boolean) => {
    onFilterChange({
      ...activeFilters,
      inStock: checked || undefined
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: categorySlug,
      sortBy: activeFilters.sortBy
    });
    setLocalPriceRange(priceRange);
  };

  const hasActiveFilters = 
    activeFilters.brand || 
    activeFilters.priceRange ||
    activeFilters.inStock ||
    (activeFilters.specifications && Object.keys(activeFilters.specifications).length > 0);

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['brand', 'price', 'stock']} className="space-y-2">
        {/* Brand Filter */}
        <AccordionItem value="brand" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-2">Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`brand-${brand.slug}`}
                    checked={activeFilters.brand === brand.slug}
                    onCheckedChange={(checked) => handleBrandChange(brand.slug, checked as boolean)}
                  />
                  <Label htmlFor={`brand-${brand.slug}`} className="text-sm cursor-pointer">
                    {brand.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-2">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4">
              <Slider
                min={priceRange[0]}
                max={priceRange[1]}
                step={100}
                value={localPriceRange}
                onValueChange={(value) => setLocalPriceRange(value as [number, number])}
                onValueCommit={handlePriceCommit}
                className="mb-4"
              />
              <div className="flex items-center justify-between text-sm">
                <span>₹{localPriceRange[0].toLocaleString()}</span>
                <span>₹{localPriceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Stock Filter */}
        <AccordionItem value="stock" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-2">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <Checkbox
                id="in-stock"
                checked={activeFilters.inStock || false}
                onCheckedChange={(checked) => handleStockChange(checked as boolean)}
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category-specific filters */}
        {categoryFilters.map((filter) => {
          if (filter.key === 'brand') return null; // Already handled above
          
          return (
            <AccordionItem key={filter.key} value={filter.key} className="border-b">
              <AccordionTrigger className="text-sm font-medium py-2">
                {filter.label}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filter.options?.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <Checkbox
                        id={`${filter.key}-${option}`}
                        checked={activeFilters.specifications?.[filter.key] === option}
                        onCheckedChange={(checked) => 
                          handleSpecChange(filter.key, option, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`${filter.key}-${option}`} 
                        className="text-sm cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
