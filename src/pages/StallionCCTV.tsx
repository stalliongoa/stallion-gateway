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
import cctvHeroBg from "@/assets/cctv-hero-bg.png";
import ipCCTVImage from "@/assets/ip-cctv.jpg";
import analogCamerasImage from "@/assets/analog-cameras.webp";
import wifiCamerasImage from "@/assets/wifi-cameras.jpg";
import ptzCamerasImage from "@/assets/ptz-cameras.jpeg";
import accessControlImage from "@/assets/access-control.webp";
import videoDoorPhoneImage from "@/assets/video-door-phone.webp";
import cctvSoftwareImage from "@/assets/cctv-software.webp";
import nvrDvrSystemImage from "@/assets/nvr-dvr-system.jpg";
import sapanaRajValleyImage from "@/assets/sapana-raj-valley.jpg";
import hotelNavilExoticaImage from "@/assets/hotel-navil-exotica.webp";
import paiKaneImage from "@/assets/pai-kane.jpg";
import nikhilChinappaImage from "@/assets/nikhil-chinappa.jpeg";
import happyBracesImage from "@/assets/happy-braces.jpg";
import materDeiImage from "@/assets/mater-dei.jpg";
import nikhilChinappaTestimonialImage from "@/assets/nikhil-chinappa-testimonial.jpeg";
import swapnilAsnodkarImage from "@/assets/swapnil-asnodkar.jpeg";
import drVardhanBhobeImage from "@/assets/dr-vardhan-bhobe.jpg";
import pvJayaprakashImage from "@/assets/pv-jayaprakash.jpg";

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
      image: ipCCTVImage
    },
    {
      name: "Analog HD Cameras",
      description: "Cost-effective surveillance with HD quality",
      features: ["1080p HD", "Weatherproof", "Wide Angle", "IR Night Vision"],
      icon: Eye,
      image: analogCamerasImage
    },
    {
      name: "NVR & DVR Systems",
      description: "Advanced recording and storage solutions",
      features: ["Up to 32 Channels", "Cloud Backup", "Mobile Viewing", "AI Analytics"],
      icon: HardDrive,
      image: nvrDvrSystemImage
    },
    {
      name: "PTZ Cameras",
      description: "Pan-Tilt-Zoom cameras for wide area coverage",
      features: ["360° Rotation", "30x Optical Zoom", "Auto Tracking", "Preset Positions"],
      icon: Monitor,
      image: ptzCamerasImage
    },
    {
      name: "Wireless Cameras",
      description: "Easy installation WiFi-enabled cameras",
      features: ["WiFi Connectivity", "Battery Backup", "2-Way Audio", "Mobile Alerts"],
      icon: Wifi,
      image: wifiCamerasImage
    },
    {
      name: "Access Control",
      description: "Integrated security access management",
      features: ["Biometric Access", "Card Readers", "Time Attendance", "Remote Control"],
      icon: Lock,
      image: accessControlImage
    },
    {
      name: "Video Door Phone",
      description: "Smart intercom with video monitoring",
      features: ["HD Video Call", "Remote Unlock", "Motion Detection", "Mobile Integration"],
      icon: Monitor,
      image: videoDoorPhoneImage
    },
    {
      name: "Centralized Monitoring Software",
      description: "Multi-location surveillance management platform",
      features: ["Multi-Site Access", "Real-time Alerts", "Custom Reports", "User Management"],
      icon: HardDrive,
      image: cctvSoftwareImage
    }
  ];

  const installations = [
    {
      title: "Sapana Raj Valley – Sangolda, Goa",
      location: "Sangolda, Goa",
      cameras: "64+ IP Cameras + 3 NVRs",
      features: "Owl Vision Night-Vision, Multi-Location Integration, Analog CCTV Merge",
      image: sapanaRajValleyImage
    },
    {
      title: "Hotel Navil Exotica – Dabolim, Goa",
      location: "Dabolim, Goa",
      cameras: "22+ IP Cameras",
      features: "LAN Integration, Remote Surveillance, Full Property Coverage",
      image: hotelNavilExoticaImage
    },
    {
      title: "Pai Kane Industries – Tuem, Goa",
      location: "Tuem, Goa",
      cameras: "IP-based Surveillance System",
      features: "Production Zone Monitoring, Network Integration, Scalable Architecture",
      image: paiKaneImage
    },
    {
      title: "Residential CCTV Installation – Mr. Nikhil Chinappa, Nerul, Goa",
      location: "Nerul, Goa",
      cameras: "Premium Home Surveillance",
      features: "HD IP Cameras, Remote Monitoring, Full Privacy Protection",
      image: nikhilChinappaImage
    },
    {
      title: "Happy Braces Dental Clinic – Porvorim, Goa",
      location: "Porvorim, Goa",
      cameras: "Analog CCTV System",
      features: "Reception & Waiting Area Coverage, Cost-Effective Solution",
      image: happyBracesImage
    },
    {
      title: "Mater Dei School – Saligao, Goa",
      location: "Saligao, Goa",
      cameras: "Campus-Wide Surveillance",
      features: "Entrance & Corridor Monitoring, Student Safety, Staff Management",
      image: materDeiImage
    }
  ];

  const testimonials = [
    {
      name: "Mr. Nikhil Chinappa",
      company: "",
      role: "Public Figure",
      rating: 5,
      text: "Stallion IT Solutions and Services did an excellent job installing the CCTV system at my residence in Nerul. The team was professional, efficient, and ensured the entire setup was secure and seamlessly integrated. Their attention to detail and commitment to quality gave me complete peace of mind. Highly recommended.",
      image: nikhilChinappaTestimonialImage
    },
    {
      name: "Mr. Swapnil Asnodkar",
      company: "Goa",
      role: "Cricketer",
      rating: 5,
      text: "Stallion IT Solutions and Services completed a customized CCTV project at my residence. The work involved servicing and troubleshooting the existing camera system, resolving connectivity and recording issues, and upgrading faulty components for improved performance. The team also optimized the layout by adding and realigning cameras to ensure better coverage, enhanced clarity, and a more reliable surveillance system overall. The upgraded setup now delivers smooth monitoring and long-term stability.",
      image: swapnilAsnodkarImage
    },
    {
      name: "Dr. Vardhan Bhobe",
      company: "Porvorim, Goa",
      role: "Physician",
      rating: 5,
      text: "Stallion IT Solutions and Services completed a reliable CCTV surveillance installation at my residence in Porvorim, Goa. The setup was designed to provide complete home security with clear monitoring and stable performance. I have been a happy and satisfied customer for over 6 years, continuing to trust Stallion for regular maintenance, upgrades, and dependable IT support.",
      image: drVardhanBhobeImage
    },
    {
      name: "Mr. P.V. Jayaprakash",
      company: "Sanquelim, Goa",
      role: "Homeowner",
      rating: 5,
      text: "So we were looking for a CCTV for our home. We are connected with one of my friend who helped me in identifying Stallion IT Solutions And Services – Goa. We contacted with some of the customers of Stallion IT solutions and then we placed the order. They promptly come down and executed job. We have seen the quality of job. The team has been very cooperating with us to our requirement of how to do where it is to be put. They have done 2/3 trials also and demonstrating us subsequently. They have also shown us how to see the recorded audios and the videos of previous days and how to take backups. We are quite happy with the quality and pricing of the CCTV installation. Thank you.",
      image: pvJayaprakashImage
    }
  ];

  const clientLogos = [
    { name: "Mahek-E-Punjab Restaurant", sector: "Restaurant" },
    { name: "Sapana Raj Valley", sector: "Housing Society" },
    { name: "Pai Kane Group", sector: "Industry" },
    { name: "Lifeline Medicals", sector: "Pharmacy" },
    { name: "Mahalaxmi Cement Products", sector: "Industry" },
    { name: "Royal Orchid", sector: "Resort" },
    { name: "Happy Braces", sector: "Clinic" },
    { name: "Saini Motors", sector: "Automotive" },
    { name: "Mater Dei", sector: "School" },
    { name: "Jain Mandir Porvorim", sector: "Temple" },
    { name: "The Lohias", sector: "Resort" },
    { name: "Ashray Developers", sector: "Real Estate" }
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
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/70 via-primary/60 to-primary/50 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${cctvHeroBg})` }}></div>
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