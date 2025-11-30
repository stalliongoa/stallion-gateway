import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Camera,
  Shield,
  Monitor,
  Wifi,
  Cloud,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Eye,
  Lock,
  Smartphone,
  HardDrive,
  AlertTriangle,
  Users,
  Building2,
  Home,
  Store
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import cctvHeroBg from "@/assets/cctv-hero-bg.jpg";

const StallionCCTV = () => {
  const heroAnimation = useScrollAnimation();
  const productsAnimation = useScrollAnimation();
  const setupsAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();
  const clientsAnimation = useScrollAnimation();

  const products = [
    {
      name: "IP CCTV Cameras",
      description: "High-resolution network cameras with advanced features",
      features: ["4K Resolution", "Night Vision", "Motion Detection", "Remote Access"],
      icon: Camera,
      image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&auto=format&fit=crop"
    },
    {
      name: "Analog HD Cameras",
      description: "Cost-effective surveillance with HD quality",
      features: ["1080p HD", "Weatherproof", "Wide Angle", "IR Night Vision"],
      icon: Eye,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop"
    },
    {
      name: "NVR & DVR Systems",
      description: "Advanced recording and storage solutions",
      features: ["Up to 32 Channels", "Cloud Backup", "Mobile Viewing", "AI Analytics"],
      icon: HardDrive,
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop"
    },
    {
      name: "PTZ Cameras",
      description: "Pan-Tilt-Zoom cameras for wide area coverage",
      features: ["360° Rotation", "30x Optical Zoom", "Auto Tracking", "Preset Positions"],
      icon: Monitor,
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop"
    },
    {
      name: "Wireless Cameras",
      description: "Easy installation WiFi-enabled cameras",
      features: ["WiFi Connectivity", "Battery Backup", "2-Way Audio", "Mobile Alerts"],
      icon: Wifi,
      image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop"
    },
    {
      name: "Access Control",
      description: "Integrated security access management",
      features: ["Biometric Access", "Card Readers", "Time Attendance", "Remote Control"],
      icon: Lock,
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop"
    },
    {
      name: "Video Door Phone",
      description: "Smart intercom with video monitoring",
      features: ["HD Video Call", "Remote Unlock", "Motion Detection", "Mobile Integration"],
      icon: Monitor,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop"
    },
    {
      name: "Centralized Monitoring Software",
      description: "Multi-location surveillance management platform",
      features: ["Multi-Site Access", "Real-time Alerts", "Custom Reports", "User Management"],
      icon: HardDrive,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop"
    }
  ];

  const installations = [
    {
      title: "Corporate Office - 64 Camera Setup",
      location: "Panjim, Goa",
      cameras: "64 IP Cameras + 2 NVR",
      features: "AI Analytics, Facial Recognition, License Plate Recognition",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop"
    },
    {
      title: "Manufacturing Plant Security",
      location: "Verna Industrial Estate, Goa",
      cameras: "128 Cameras + Central Monitoring",
      features: "Perimeter Security, Heat Detection, 24/7 Monitoring",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop"
    },
    {
      title: "Retail Chain - Multi-Store",
      location: "15 Locations Across Goa",
      cameras: "320+ Cameras Network",
      features: "Centralized Monitoring, Cloud Storage, Mobile App",
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop"
    },
    {
      title: "Residential Complex",
      location: "Porvorim, Goa",
      cameras: "96 Cameras + Gate Access Control",
      features: "Smart Entry, Visitor Management, Mobile Alerts",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop"
    },
    {
      title: "Hospital Security System",
      location: "Margao, Goa",
      cameras: "80 Cameras Multi-Floor",
      features: "Patient Safety, Emergency Response, Restricted Area Monitoring",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop"
    },
    {
      title: "Educational Institution",
      location: "Mapusa, Goa",
      cameras: "120 Cameras Campus-Wide",
      features: "Student Safety, Attendance System, Parent App Access",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "TechCorp Industries",
      role: "Security Head",
      rating: 5,
      text: "Stallion CCTV transformed our factory security. The AI-powered cameras detected an intrusion attempt that saved us from potential losses. Professional team and excellent after-sales support.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop"
    },
    {
      name: "Priya Sharma",
      company: "Green Valley Apartments",
      role: "RWA President",
      rating: 5,
      text: "The residential security solution from Stallion has made our society much safer. Parents can now check on children's entry/exit through the mobile app. Highly recommend!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop"
    },
    {
      name: "Amit Verma",
      company: "Style Mart Retail",
      role: "Operations Manager",
      rating: 5,
      text: "Managing 15 stores was challenging until Stallion installed their centralized monitoring system. Now I can view all stores from my phone. Theft incidents have reduced by 80%.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop"
    },
    {
      name: "Dr. Neha Gupta",
      company: "Wellness Hospital",
      role: "Administrator",
      rating: 5,
      text: "Patient safety is our priority. Stallion's CCTV system with restricted area monitoring has greatly improved our security protocols. The team was professional and completed installation without disrupting operations.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop"
    }
  ];

  const clientLogos = [
    { name: "DLF Limited", sector: "Real Estate" },
    { name: "Max Healthcare", sector: "Healthcare" },
    { name: "Amity University", sector: "Education" },
    { name: "Reliance Retail", sector: "Retail" },
    { name: "Hero MotoCorp", sector: "Manufacturing" },
    { name: "Godrej Properties", sector: "Real Estate" },
    { name: "ICICI Bank", sector: "Banking" },
    { name: "Apollo Hospitals", sector: "Healthcare" },
    { name: "Shoppers Stop", sector: "Retail" },
    { name: "Maruti Suzuki", sector: "Automotive" },
    { name: "ITC Limited", sector: "FMCG" },
    { name: "Fortis Hospital", sector: "Healthcare" }
  ];

  const features = [
    { icon: Shield, title: "24/7 Monitoring", description: "Round-the-clock surveillance" },
    { icon: Cloud, title: "Cloud Storage", description: "Secure remote backup" },
    { icon: Smartphone, title: "Mobile Access", description: "View from anywhere" },
    { icon: AlertTriangle, title: "Smart Alerts", description: "Instant notifications" },
    { icon: Lock, title: "Secure System", description: "Encrypted transmission" },
    { icon: Clock, title: "Playback", description: "Easy footage retrieval" }
  ];

  const sectors = [
    { icon: Building2, name: "Corporate Offices", count: "150+" },
    { icon: Store, name: "Retail Stores", count: "300+" },
    { icon: Home, name: "Residential", count: "500+" },
    { icon: Users, name: "Educational", count: "80+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${cctvHeroBg})` }}></div>
        <div className="container mx-auto px-4 relative z-10" ref={heroAnimation.ref}>
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center mb-6">
              <Camera className="h-20 w-20 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              STALLION CCTV
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
              Advanced Surveillance Solutions for Complete Security
            </p>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/80 max-w-3xl mx-auto">
              Leading CCTV installation and security systems provider in Goa. Trusted by 1000+ clients across corporate, retail, residential & industrial sectors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="#contact">Get Free Quote</a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="tel:+917875811148">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Brands Section */}
      <section className="py-16 bg-background border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Associated Brands</h2>
            <p className="text-lg text-muted-foreground">Authorized dealers of world's leading CCTV brands</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex animate-[slide_30s_linear_infinite] gap-12 items-center">
              {[
                "CP Plus", "Hikvision", "Dahua", "Honeywell", "TP-Link",
                "D-Link", "UNV", "Active Pixel", "Digisol",
                "Axis Communications", "Samsung Wisenet", "Uniview", "Hanwha Techwin",
                "Panasonic", "Sony Professional", "Avigilon",
                "CP Plus", "Hikvision", "Dahua", "Honeywell", "TP-Link",
                "D-Link", "UNV", "Active Pixel", "Digisol"
              ].map((brand, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 h-24 flex items-center justify-center bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-lg font-semibold text-foreground px-4 text-center">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Stallion CCTV?</h2>
            <p className="text-lg text-muted-foreground">Cutting-edge technology with reliable service</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20" ref={productsAnimation.ref}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${productsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products & Solutions</h2>
            <p className="text-lg text-muted-foreground">Comprehensive range of surveillance equipment</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const Icon = product.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }}></div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-bold">{product.name}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    <ul className="space-y-2">
                      {product.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Installations Section */}
      <section className="py-20 bg-muted/30" ref={setupsAnimation.ref}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${setupsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Installations</h2>
            <p className="text-lg text-muted-foreground">Showcasing our successful CCTV projects</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {installations.map((installation, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${installation.image})` }}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{installation.title}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {installation.location}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Camera className="h-4 w-4" />
                      {installation.cameras}
                    </p>
                    <p className="flex items-center gap-2 text-primary font-medium">
                      <CheckCircle className="h-4 w-4" />
                      {installation.features}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" ref={testimonialsAnimation.ref}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${testimonialsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-lg text-muted-foreground">Hear from our satisfied customers</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${testimonial.image})` }}></div>
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm font-medium text-primary">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-muted/30" ref={clientsAnimation.ref}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${clientsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Valued Clients</h2>
            <p className="text-lg text-muted-foreground">Trusted by leading organizations</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {clientLogos.map((client, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h4 className="font-bold text-lg mb-1">{client.name}</h4>
                <p className="text-sm text-muted-foreground">{client.sector}</p>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                  <Icon className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h4 className="font-bold text-2xl text-primary mb-1">{sector.count}</h4>
                  <p className="text-muted-foreground">{sector.name}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Secure Your Premises?</h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Get a free consultation and quote from our CCTV experts. We'll design a customized security solution for your needs.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-primary-foreground/10 border-primary-foreground/20">
                <Phone className="h-8 w-8 mx-auto mb-3 text-primary-foreground" />
                <p className="text-sm mb-2">Call Us</p>
                <a href="tel:+917875811148" className="font-bold text-lg hover:underline">+91 78758 11148</a>
              </Card>
              <Card className="p-6 bg-primary-foreground/10 border-primary-foreground/20">
                <Mail className="h-8 w-8 mx-auto mb-3 text-primary-foreground" />
                <p className="text-sm mb-2">Email Us</p>
                <a href="mailto:info@stallion.co.in" className="font-bold text-lg hover:underline">info@stallion.co.in</a>
              </Card>
              <Card className="p-6 bg-primary-foreground/10 border-primary-foreground/20">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-primary-foreground" />
                <p className="text-sm mb-2">Visit Us</p>
                <p className="font-bold text-lg">Porvorim, Goa</p>
              </Card>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Schedule Free Site Survey</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StallionCCTV;