import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useShopAuth } from '@/hooks/use-shop-auth';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/types/shop';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useShopAuth();
  const { addToCart } = useCart();

  const discount = product.mrp && product.selling_price 
    ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
    : 0;

  const imageUrl = product.images?.[0] || '/placeholder.svg';

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/shop/product/${product.slug}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <Badge className="bg-stallion-gold text-stallion-navy">Featured</Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-red-500 text-white">{discount}% OFF</Badge>
          )}
          {product.stock_quantity === 0 && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Link to={`/shop/product/${product.slug}`}>
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {product.brand && (
            <span className="font-medium">{product.brand.name}</span>
          )}
        </div>

        {/* Product name */}
        <Link to={`/shop/product/${product.slug}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-stallion-gold transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-stallion-navy">
                ₹{Number(product.selling_price || 0).toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > (product.selling_price || 0) && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{Number(product.mrp).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <Link to="/shop/auth" className="text-stallion-gold hover:underline">
                Login to see price
              </Link>
            </div>
          )}
        </div>

        {/* Add to cart */}
        {user && product.stock_quantity > 0 && (
          <Button 
            className="w-full bg-stallion-navy hover:bg-stallion-navy/90"
            size="sm"
            onClick={() => addToCart(product.id)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        )}
        
        {!user && (
          <Link to="/shop/auth">
            <Button className="w-full" variant="outline" size="sm">
              Login to Purchase
            </Button>
          </Link>
        )}
        
        {user && product.stock_quantity === 0 && (
          <Button className="w-full" variant="secondary" size="sm" disabled>
            Out of Stock
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
