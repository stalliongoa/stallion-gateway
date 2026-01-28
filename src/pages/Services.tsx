import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Network, 
  Camera, 
  Wifi, 
  HardDrive, 
  ShoppingCart, 
  GraduationCap,
  Shield,
  Server,
  Home
} from "lucide-react";
import servicesHeroBanner from "@/assets/services-hero-banner.jpg";

const Services = () => {
  const services = [
    {
      icon: <Network className="h-10 w-10 text-secondary" />,
      title: "IT Network Design & Implementation",
      description: "Crafting robust and scalable IT networks tailored to your business needs, ensuring seamless connectivity and optimal performance.",
      features: ["Network Planning", "Infrastructure Setup", "Performance Optimization", "24/7 Support"]
    },
    {
      icon: <Camera className="h-10 w-10 text-secondary" />,
      title: "Surveillance CCTV Setups & Maintenance",
      description: "Providing cutting-edge CCTV solutions for comprehensive security, coupled with regular maintenance to ensure uninterrupted surveillance.",
      features: ["IP Camera Installation", "NVR Configuration", "Remote Monitoring", "Regular Maintenance"]
    },
    {
      icon: <Wifi className="h-10 w-10 text-secondary" />,
      title: "Home & Office WiFi Setups",
      description: "Delivering reliable and high-performance WiFi setups for homes and offices, enhancing connectivity and productivity in every corner.",
      features: ["Heatmap Planning", "Access Point Installation", "Network Security", "Speed Optimization"]
    },
    {
      icon: <Server className="h-10 w-10 text-secondary" />,
      title: "Server Setup & Maintenance",
      description: "Complete server solutions including setup, configuration, backup management, and troubleshooting for business continuity.",
      features: ["Server Installation", "Data Backup", "System Updates", "Performance Monitoring"]
    },
    {
      icon: <Shield className="h-10 w-10 text-secondary" />,
      title: "IT AMC Services",
      description: "Comprehensive Annual Maintenance Contracts ensuring your IT infrastructure runs smoothly with proactive support and regular visits.",
      features: ["Regular Visits", "Priority Support", "Preventive Maintenance", "Emergency Response"]
    },
    {
      icon: <ShoppingCart className="h-10 w-10 text-secondary" />,
      title: "IT Sales & Procurement",
      description: "A curated selection of top-notch IT products available for purchase, ensuring quality and reliability for your business needs.",
      features: ["Hardware Sales", "Software Licensing", "Product Consultation", "Installation Support"]
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-secondary" />,
      title: "IT Training for Staff",
      description: "Empowering your team with specialized IT training, equipping them to confidently handle emergencies and maximize operational efficiency.",
      features: ["Emergency Response Training", "System Usage Training", "Cybersecurity Awareness", "Custom Workshops"]
    },
    {
      icon: <Home className="h-10 w-10 text-secondary" />,
      title: "Smart Home & Office Automation",
      description: "Transform your space with intelligent automation solutions for enhanced comfort, security, and energy efficiency.",
      features: ["Smart Lighting", "Climate Control", "Security Integration", "Voice Control"]
    },
    {
      icon: <HardDrive className="h-10 w-10 text-secondary" />,
      title: "Data Recovery Services",
      description: "Professional data recovery solutions to retrieve critical business data from failed drives, servers, or corrupted storage systems.",
      features: ["Hard Drive Recovery", "RAID Recovery", "Server Data Recovery", "Emergency Services"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section with Banner */}
        <section className="relative min-h-[50vh] md:min-h-[60vh] overflow-hidden">
          {/* Banner Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${servicesHeroBanner})` }}
          />
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/70 via-[#0a1628]/50 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 flex items-center min-h-[50vh] md:min-h-[60vh]">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Our <span className="text-[#c9a55c]">Services</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                Comprehensive IT solutions tailored for hotels, resorts, and businesses
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="shadow-subtle hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4">{service.icon}</div>
                    <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                    <CardDescription className="text-foreground/70">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-foreground/70 flex items-center">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Service Initiative */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-primary">Community Education Programs</h2>
              <p className="text-lg mb-8 text-foreground/80">
                As part of our commitment to community development, we offer educational workshops and training sessions for schools and educational institutions.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-subtle">
                  <CardContent className="p-6 text-center">
                    <Camera className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2 text-primary">CCTV Awareness</h3>
                    <p className="text-sm text-foreground/70">Teaching students about surveillance technology and security systems</p>
                  </CardContent>
                </Card>
                <Card className="shadow-subtle">
                  <CardContent className="p-6 text-center">
                    <Wifi className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2 text-primary">WiFi & Networking</h3>
                    <p className="text-sm text-foreground/70">Hands-on training about network setup and connectivity basics</p>
                  </CardContent>
                </Card>
                <Card className="shadow-subtle">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2 text-primary">Cyber Safety</h3>
                    <p className="text-sm text-foreground/70">Educating about UPI frauds, online safety, and cybersecurity awareness</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-primary">Ready to Transform Your IT Infrastructure?</h2>
              <p className="text-lg mb-8 text-foreground/70">
                Let's discuss how our services can benefit your business
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="default" asChild>
                  <Link to="/contact">Book Free IT Audit</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/amc-plans">View AMC Plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
