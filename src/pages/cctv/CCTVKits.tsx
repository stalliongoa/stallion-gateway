import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Camera, 
  Clock, 
  Headphones, 
  CheckCircle2, 
  ArrowRight,
  Star,
  Zap,
  Eye,
  Phone,
  Calendar,
} from 'lucide-react';
import { useActiveKits } from '@/hooks/use-cctv-kits';
import { cn } from '@/lib/utils';

export default function CCTVKits() {
  const { data: kits, isLoading } = useActiveKits();
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              <Shield className="h-3 w-3 mr-1" />
              Professional CCTV Solutions
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Stallion CCTV{' '}
              <span className="text-primary">Security Kits</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Complete surveillance solutions designed for homes and businesses. 
              Professional-grade equipment, expert installation, and reliable support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <a href="#kits">
                  Explore Kits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to Expert
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Badges */}
      <section className="py-8 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">HD Quality</p>
                <p className="text-sm text-muted-foreground">2MP - 5MP Cameras</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Night Vision</p>
                <p className="text-sm text-muted-foreground">24/7 Monitoring</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Expert Support</p>
                <p className="text-sm text-muted-foreground">Professional Team</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Quick Install</p>
                <p className="text-sm text-muted-foreground">Same Day Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Kits Section */}
      <section id="kits" className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Security Kit
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pre-configured surveillance packages with everything you need for a complete security setup
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : !kits?.length ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-center mb-4">
                  We're preparing our CCTV kit collection. Check back soon!
                </p>
                <Button asChild>
                  <Link to="/contact">Contact Us for Custom Quote</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {kits.map((kit) => (
                <Card key={kit.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  {/* Kit Image */}
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {kit.image_url ? (
                      <img
                        src={kit.image_url}
                        alt={kit.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {kit.has_free_wifi_camera && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <Zap className="h-3 w-3 mr-1" />
                          FREE WiFi Camera
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    {/* Kit Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold line-clamp-2">{kit.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{kit.channel_capacity} Channel</Badge>
                        <Badge variant="outline">{kit.camera_resolution}</Badge>
                        <Badge variant="secondary">{kit.kit_type.toUpperCase()}</Badge>
                      </div>
                    </div>
                    
                    {/* Highlights */}
                    {kit.short_highlights && kit.short_highlights.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {kit.short_highlights.slice(0, 4).map((highlight, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {/* Price */}
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground">Starting at</p>
                      <p className="text-3xl font-bold text-primary">
                        ₹{kit.selling_price.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Inclusive of installation</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" asChild className="col-span-1">
                        <Link to={`/cctv/cctv-kits/${kit.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="col-span-1">
                        <Link to={`/contact?kit=${kit.slug}`}>
                          <Phone className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild className="col-span-1">
                        <Link to={`/contact?kit=${kit.slug}&action=book`}>
                          <Calendar className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                      <p className="text-xs text-muted-foreground">Explore</p>
                      <p className="text-xs text-muted-foreground">Enquire</p>
                      <p className="text-xs text-muted-foreground">Book</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Stallion Security?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
              <p className="text-muted-foreground">
                We use only top-tier brands like CP Plus, Hikvision, and Dahua for reliable surveillance.
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Installation</h3>
              <p className="text-muted-foreground">
                Our trained technicians ensure professional installation with clean cable management.
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Warranty & Support</h3>
              <p className="text-muted-foreground">
                Comprehensive warranty on all products with dedicated after-sales support.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Need a Custom Solution?
                </h2>
                <p className="text-lg opacity-90 mb-8">
                  Our security experts can design a tailored surveillance system 
                  based on your specific requirements and budget.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/contact">
                      Get Free Consultation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10" asChild>
                    <a href="tel:+919876543210">
                      <Phone className="mr-2 h-5 w-5" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
