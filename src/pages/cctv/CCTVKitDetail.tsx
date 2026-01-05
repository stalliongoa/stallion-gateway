import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  ArrowLeft,
  Shield,
  Package,
  HardDrive,
  Monitor,
  Zap,
  Gift,
} from 'lucide-react';
import { useKitBySlug } from '@/hooks/use-cctv-kits';
import type { ProductType } from '@/types/cctv-kit';

const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  camera: 'Cameras',
  dvr: 'DVR',
  nvr: 'NVR',
  smps: 'Power Supply',
  hard_drive: 'Storage',
  cable: 'Cables',
  monitor: 'Display',
  ups: 'Power Backup',
  rack: 'Enclosure',
  accessory: 'Accessories',
  wifi_camera: 'WiFi Camera',
};

export default function CCTVKitDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: kit, isLoading, error } = useKitBySlug(slug);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !kit) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-20">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Camera className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Kit Not Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                The requested CCTV kit could not be found.
              </p>
              <Button asChild>
                <Link to="/cctv/cctv-kits">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Kits
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Group items by product type
  const groupedItems = kit.items?.reduce((acc, item) => {
    const type = item.product_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, typeof kit.items>) || {};
  
  // Generate default description if not provided
  const description = kit.long_description || 
    `Secure your home or business with our professionally designed ${kit.camera_resolution} ${kit.channel_capacity} Channel CCTV kit. This complete solution includes high-quality cameras, reliable recording, power backup, and all accessories required for seamless installation.`;
  
  const defaultHighlights = [
    'High-resolution cameras with night vision',
    'Reliable recording & storage',
    'Power backup included',
    'Professional-grade accessories',
    'Expert installation available',
    'Comprehensive warranty',
  ];
  
  const highlights = kit.short_highlights?.length ? kit.short_highlights : defaultHighlights;
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="container py-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/cctv/cctv-kits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Kits
          </Link>
        </Button>
      </div>
      
      {/* Kit Header */}
      <section className="container pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
              {kit.image_url ? (
                <img
                  src={kit.image_url}
                  alt={kit.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>
            {kit.has_free_wifi_camera && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 hover:bg-green-600 text-lg py-1 px-3">
                  <Gift className="h-4 w-4 mr-1" />
                  FREE WiFi Camera Included!
                </Badge>
              </div>
            )}
          </div>
          
          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{kit.channel_capacity} Channel</Badge>
              <Badge variant="outline">{kit.camera_resolution}</Badge>
              <Badge variant="secondary">{kit.kit_type.toUpperCase()}</Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{kit.name}</h1>
            
            <p className="text-lg text-muted-foreground mb-6">{description}</p>
            
            {/* Price */}
            <div className="p-6 bg-muted/50 rounded-xl mb-6">
              <p className="text-sm text-muted-foreground mb-1">Complete Kit Price</p>
              <p className="text-4xl font-bold text-primary mb-1">
                ₹{kit.selling_price.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Inclusive of all components and professional installation
              </p>
            </div>
            
            {/* CTAs */}
            <div className="grid grid-cols-2 gap-4">
              <Button size="lg" variant="outline" asChild>
                <Link to={`/contact?kit=${kit.slug}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Enquire Now
                </Link>
              </Button>
              <Button size="lg" asChild>
                <Link to={`/contact?kit=${kit.slug}&action=book`}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Installation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Highlights */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </section>
      
      <Separator />
      
      {/* What's Included */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-6">What's Included</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedItems).map(([type, items]) => (
            <Card key={type}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {PRODUCT_TYPE_LABELS[type as ProductType] || type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{item.product_name}</span>
                    <div className="flex items-center gap-2">
                      {item.is_free_item ? (
                        <Badge variant="secondary" className="text-green-600 bg-green-50">FREE</Badge>
                      ) : (
                        <Badge variant="outline">
                          x{item.quantity}{item.unit_type === 'meters' ? 'm' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Trust Section */}
      <section className="bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                All products come with manufacturer warranty
              </p>
            </div>
            <div>
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Expert Installation</h3>
              <p className="text-sm text-muted-foreground">
                Professional setup by trained technicians
              </p>
            </div>
            <div>
              <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Dedicated Support</h3>
              <p className="text-sm text-muted-foreground">
                After-sales support when you need it
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="container py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Secure Your Property?
            </h2>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Get this complete CCTV kit installed by our experts. 
              Contact us today for a free site survey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to={`/contact?kit=${kit.slug}&action=book`}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Installation
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10" asChild>
                <a href="tel:+919876543210">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +91 98765 43210
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <Footer />
    </div>
  );
}
