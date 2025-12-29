import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, ChevronRight, FileText, Share2, Check } from 'lucide-react';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShopAuth } from '@/hooks/use-shop-auth';
import { useCart } from '@/hooks/use-cart';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/shop';

export default function ProductDetail() {
  const { productSlug } = useParams();
  const { user } = useShopAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productSlug) {
      fetchProduct();
    }
  }, [productSlug]);

  const fetchProduct = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('shop_products')
      .select(`
        *,
        category:shop_categories(*),
        brand:shop_brands(*)
      `)
      .eq('slug', productSlug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching product:', error);
    } else if (data) {
      setProduct(data as unknown as Product);
      
      // Fetch related products
      if (data.category_id) {
        const { data: related } = await supabase
          .from('shop_products')
          .select(`
            *,
            category:shop_categories(*),
            brand:shop_brands(*)
          `)
          .eq('category_id', data.category_id)
          .eq('is_active', true)
          .neq('id', data.id)
          .limit(4);

        if (related) {
          setRelatedProducts(related as unknown as Product[]);
        }
      }
    }

    setIsLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  const discount = product?.mrp && product?.selling_price
    ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
    : 0;

  const images = product?.images?.length ? product.images : ['/placeholder.svg'];

  if (isLoading) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-64 mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </ShopLayout>
    );
  }

  if (!product) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/shop/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/shop" className="text-muted-foreground hover:text-foreground">Shop</Link></li>
            <li className="text-muted-foreground"><ChevronRight className="h-4 w-4" /></li>
            {product.category && (
              <>
                <li>
                  <Link 
                    to={`/shop/category/${product.category.slug}`} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {product.category.name}
                  </Link>
                </li>
                <li className="text-muted-foreground"><ChevronRight className="h-4 w-4" /></li>
              </>
            )}
            <li className="font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index ? 'border-stallion-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-stallion-gold font-medium mb-2">{product.brand.name}</p>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

            {/* SKU */}
            {product.sku && (
              <p className="text-sm text-muted-foreground mb-4">SKU: {product.sku}</p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.stock_quantity > 0 ? (
                <Badge className="bg-green-100 text-green-700">
                  <Check className="h-3 w-3 mr-1" />
                  In Stock
                </Badge>
              ) : (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-stallion-gold text-stallion-navy">Featured</Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-red-100 text-red-700">{discount}% OFF</Badge>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              {user ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-stallion-navy">
                    ₹{Number(product.selling_price || 0).toLocaleString('en-IN')}
                  </span>
                  {product.mrp && product.mrp > (product.selling_price || 0) && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{Number(product.mrp).toLocaleString('en-IN')}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-green-600 font-medium">
                      You save ₹{(product.mrp! - product.selling_price!).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-muted-foreground mb-2">Login to see pricing and add to cart</p>
                  <Link to="/shop/auth">
                    <Button className="bg-stallion-gold hover:bg-stallion-gold/90 text-stallion-navy">
                      Login to Continue
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Short description */}
            {product.short_description && (
              <p className="text-muted-foreground mb-6">{product.short_description}</p>
            )}

            {/* Add to cart */}
            {user && product.stock_quantity > 0 && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.stock_quantity} available
                  </span>
                </div>

                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="flex-1 bg-stallion-navy hover:bg-stallion-navy/90"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Datasheet */}
            {product.datasheet_url && (
              <a 
                href={product.datasheet_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-stallion-gold hover:underline mb-6"
              >
                <FileText className="h-4 w-4" />
                Download Datasheet
              </a>
            )}

            {/* Warranty */}
            {product.warranty_months && (
              <p className="text-sm text-muted-foreground">
                <strong>Warranty:</strong> {product.warranty_months} months
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p className="text-muted-foreground">No description available.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-4 py-3 font-medium text-sm w-1/3 border-r">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </td>
                        <td className="px-4 py-3 text-sm">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">No specifications available.</p>
            )}
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </ShopLayout>
  );
}
