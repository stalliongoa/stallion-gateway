import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import stallionLogo from "@/assets/stallion-gold-logo.png";
import heroVideo from "@/assets/hero-video.mp4";
import { supabase } from "@/integrations/supabase/client";
import { 
  Network, 
  Camera, 
  Wifi, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Users,
  TrendingUp,
  ArrowRight,
  Phone
} from "lucide-react";

const Index = () => {
  const [sachinImage, setSachinImage] = useState<string | null>(null);
  const [ravishImage, setRavishImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonialImages = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("name, image_url")
        .in("name", ["Mr Sachin Patil", "Mr. Ravish Tople"]);

      if (error) {
        console.error("Error fetching testimonial images:", error);
        return;
      }

      data?.forEach((client) => {
        if (client.name === "Mr Sachin Patil") {
          setSachinImage(client.image_url);
        }
        if (client.name === "Mr. Ravish Tople") {
          setRavishImage(client.image_url);
        }
      });
    };

    fetchTestimonialImages();
  }, []);

  const services = [
    {
      icon: <Network className="h-10 w-10 text-secondary" />,
      title: "IT Network Design",
      description: "Robust and scalable network infrastructure tailored to your business"
    },
    {
      icon: <Camera className="h-10 w-10 text-secondary" />,
      title: "CCTV Surveillance",
      description: "Cutting-edge security solutions with 24/7 monitoring capabilities"
    },
    {
      icon: <Wifi className="h-10 w-10 text-secondary" />,
      title: "WiFi Solutions",
      description: "High-performance wireless networks with heatmap planning"
    },
    {
      icon: <Shield className="h-10 w-10 text-secondary" />,
      title: "IT AMC Services",
      description: "Comprehensive maintenance contracts with priority support"
    }
  ];

  const stats = [
    {
      icon: <Clock className="h-8 w-8 text-secondary" />,
      value: "10+",
      label: "Years Experience"
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      value: "100+",
      label: "AMC Clients"
    },
    {
      icon: <Camera className="h-8 w-8 text-secondary" />,
      value: "1000+",
      label: "CCTV Setups"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-secondary" />,
      value: "24hr",
      label: "Response Time"
    }
  ];

  const features = [
    "Specialized in hospitality industry IT solutions",
    "Experienced team with 10+ years in the field",
    "24/7 emergency support available",
    "Proactive maintenance and monitoring",
    "Free IT consultation and staff training",
    "Competitive pricing with flexible plans"
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navigation />
      
      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section with Video */}
        <section className="relative w-full">
          {/* Hero Video - Full Width */}
          <div className="w-full">
            <video 
              src={heroVideo} 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-auto object-contain"
            />
          </div>
          
          {/* Buttons Below Video */}
          <div className="absolute bottom-0 left-0 right-0 z-10 pb-4 sm:pb-8">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
                <Button size="lg" className="bg-stallion-gold hover:bg-stallion-gold/90 text-stallion-navy font-semibold border-2 border-stallion-gold w-full sm:w-auto">
                  <Link to="/contact" className="flex items-center">
                    Book Free IT Audit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-stallion-gold text-stallion-gold hover:bg-stallion-gold hover:text-stallion-navy w-full sm:w-auto" asChild>
                  <Link to="/amc-plans">View AMC Plans</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-stallion-gold text-stallion-gold hover:bg-stallion-gold hover:text-stallion-navy w-full sm:w-auto" asChild>
                  <a href="tel:+917875811148">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center shadow-subtle hover:shadow-gold transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-3">{stat.icon}</div>
                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-foreground/70">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Our Core Services</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Comprehensive IT solutions designed specifically for the hospitality and business sectors
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="shadow-subtle hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4">{service.icon}</div>
                    <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link to="/services">
                  View All Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Why Choose Stallion?</h2>
                <p className="text-lg text-foreground/70">
                  We emphasize understanding client objectives and use technology to streamline operations
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="shadow-subtle">
                    <CardContent className="p-6 flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80">{feature}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Project */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Featured Project</h2>
                <p className="text-lg text-foreground/70">Recent success story from 2023-24</p>
              </div>
              <Card className="shadow-medium">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl text-primary">Elements by Rosetta - Varca Goa</CardTitle>
                    <Badge variant="secondary">2023</Badge>
                  </div>
                  <CardDescription className="text-base">
                    A beautiful 76-room property at Varca launched in November 2023, featuring our complete High Tech IT setup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Complete network design & implementation</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">IP-based CCTV integration</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">High-speed Giga WiFi systems</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Firewall security setup</span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link to="/projects">
                      View All Projects
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Client Testimonials</h2>
              <p className="text-lg text-foreground/70">
                Hear from our satisfied clients about their experience with Stallion IT Solutions
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="shadow-medium">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <svg className="h-8 w-8 text-secondary/40 mb-4" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-foreground/80 italic text-sm leading-relaxed">
                      "For over 10 years, Stallion IT Solutions and Services has been our trusted technology partner, managing the complete IT infrastructure of our office, including a network of 50+ computers, servers, and CCTV systems. Their professionalism, reliability, and fast response have always stood out. A special mention to Mr. Tukaram Kunkalikar, whose experience and expertise in servers, networking, and CCTV setups have kept our operations running smoothly."
                    </p>
                  </div>
                  <div className="flex items-center">
                    {sachinImage ? (
                      <img
                        src={sachinImage}
                        alt="Mr Sachin Patil"
                        className="w-12 h-12 rounded-full mr-4 border-2 border-secondary object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mr-4 text-secondary font-bold">
                        SP
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-primary">Mr Sachin Patil</p>
                      <p className="text-sm text-foreground/70">Rubiq Solutions Pvt. Ltd</p>
                      <Badge variant="secondary" className="mt-1 text-xs">IT Consultation for Office setup</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-medium">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <svg className="h-8 w-8 text-secondary/40 mb-4" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-foreground/80 italic text-sm leading-relaxed">
                      "Stallion IT Solutions and Services has been an invaluable IT partner for Insignia Group, supporting our real estate office and multiple client projects with complete reliability and professionalism. Their expertise in network design, CCTV setups, automation systems, and IT infrastructure for new apartment projects has helped us execute our work seamlessly and efficiently."
                    </p>
                  </div>
                  <div className="flex items-center">
                    {ravishImage ? (
                      <img
                        src={ravishImage}
                        alt="Mr. Ravish Tople"
                        className="w-12 h-12 rounded-full mr-4 border-2 border-secondary object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mr-4 text-secondary font-bold">
                        RT
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-primary">Mr. Ravish Tople</p>
                      <p className="text-sm text-foreground/70">Insignia Group</p>
                      <Badge variant="secondary" className="mt-1 text-xs">Network Design</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 hero-gradient text-primary-foreground">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your IT Infrastructure?</h2>
              <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
                Book your free IT audit today and discover how we can help your business thrive
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/contact">Book Free Audit</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <a href="tel:+917875811148">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Us Now
                  </a>
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

export default Index;
