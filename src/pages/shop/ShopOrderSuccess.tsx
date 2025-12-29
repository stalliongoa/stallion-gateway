import { useSearchParams, Link } from 'react-router-dom';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function ShopOrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto text-center">
          <CardContent className="pt-12 pb-8 space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-shop-navy">Order Placed Successfully!</h1>
              <p className="text-muted-foreground">
                Thank you for your order. We've received your order and will begin processing it soon.
              </p>
            </div>

            {orderNumber && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-xl font-bold text-shop-orange">{orderNumber}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>You will receive an email confirmation shortly</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link to="/shop/products">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/shop/orders">
                <Button className="bg-shop-orange hover:bg-shop-orange-dark">
                  View My Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShopLayout>
  );
}
