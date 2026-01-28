import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StatsCounter from "@/components/StatsCounter";
import Certifications from "@/components/Certifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import stallionLogo from "@/assets/stallion-gold-logo.png";
import heroBanner from "@/assets/about-us-hero-banner.jpg";
import mascotBanner from "@/assets/mascot-banner.jpg";
import { supabase } from "@/integrations/supabase/client";
import { 
  Network, 
  Camera, 
  Wifi, 
  Shield, 
  CheckCircle2, 
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
        {/* Hero Section with Image */}
        <section className="relative w-full">
          {/* Hero Image - Full Width */}
          <div className="relative w-full">
            <img 
              src={heroBanner} 
              alt="Stallion IT Solutions - Empowering Your Business with Cutting-Edge IT Solutions"
              className="w-full h-auto object-cover min-h-[180px] xs:min-h-[220px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px] 3xl:min-h-[800px] 4xl:min-h-[1000px] 5xl:min-h-[1200px]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            
            {/* Text Overlay on Right */}
            <div className="absolute inset-0 flex items-center justify-end">
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#0a1628]/90 via-[#0a1628]/60 to-transparent" />
              <div className="relative z-10 text-right pr-4 sm:pr-8 md:pr-12 lg:pr-16 xl:pr-20 2xl:pr-24 3xl:pr-32 4xl:pr-40 5xl:pr-48">
                <h1 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl 5xl:text-8xl font-bold text-white mb-1 sm:mb-2 lg:mb-3 2xl:mb-4 3xl:mb-6 leading-tight">
                  Empowering<br />
                  Your Business with<br />
                  <span className="text-[#c9a55c]">Cutting-Edge IT Solutions</span>
                </h1>
                <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-[#c9a55c] font-medium">
                  Innovative • Reliable • Secure
                </p>
              </div>
            </div>
            
            {/* CTA Buttons - Positioned over the image on the right */}
            <div className="absolute bottom-[4%] xs:bottom-[6%] sm:bottom-[8%] lg:bottom-[10%] 2xl:bottom-[12%] right-[3%] xs:right-[4%] sm:right-[5%] md:right-[6%] lg:right-[8%] 2xl:right-[10%] flex flex-col xs:flex-row gap-0.5 xs:gap-1 sm:gap-2 lg:gap-3 2xl:gap-4 3xl:gap-6">
              <Button 
                size="sm" 
                className="bg-stallion-gold hover:bg-stallion-gold/90 text-stallion-navy font-semibold text-[7px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl px-1 xs:px-1.5 sm:px-3 md:px-4 lg:px-5 2xl:px-6 3xl:px-8 4xl:px-10 py-0.5 xs:py-1 sm:py-2 lg:py-2.5 2xl:py-3 3xl:py-4 4xl:py-5 h-auto rounded-sm xs:rounded-md lg:rounded-lg shadow-lg whitespace-nowrap" 
                asChild
              >
                <Link to="/contact">
                  Book Your Free IT Audit
                  <ArrowRight className="ml-0.5 xs:ml-1 lg:ml-2 h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6 3xl:h-8 3xl:w-8" />
                </Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-stallion-gold hover:bg-stallion-gold/90 text-stallion-navy font-semibold text-[7px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl px-1 xs:px-1.5 sm:px-3 md:px-4 lg:px-5 2xl:px-6 3xl:px-8 4xl:px-10 py-0.5 xs:py-1 sm:py-2 lg:py-2.5 2xl:py-3 3xl:py-4 4xl:py-5 h-auto rounded-sm xs:rounded-md lg:rounded-lg shadow-lg whitespace-nowrap" 
                asChild
              >
                <Link to="/amc-plans">View AMC Plans</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-stallion-gold hover:bg-stallion-gold/90 text-stallion-navy font-semibold text-[7px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl px-1 xs:px-1.5 sm:px-3 md:px-4 lg:px-5 2xl:px-6 3xl:px-8 4xl:px-10 py-0.5 xs:py-1 sm:py-2 lg:py-2.5 2xl:py-3 3xl:py-4 4xl:py-5 h-auto rounded-sm xs:rounded-md lg:rounded-lg shadow-lg whitespace-nowrap" 
                asChild
              >
                <Link to="/stallion-cctv">Stallion CCTV</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Animated Stats Counter */}
        <StatsCounter />

        {/* Services Preview */}
        <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 2xl:py-24 3xl:py-32 4xl:py-40">
          <div className="container mx-auto px-3 xs:px-4 max-w-7xl 3xl:max-w-[1800px] 4xl:max-w-[2400px] 5xl:max-w-[3200px]">
            <div className="text-center mb-6 xs:mb-8 sm:mb-12 lg:mb-16 2xl:mb-20 3xl:mb-24">
              <h2 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-8xl font-bold mb-3 xs:mb-4 lg:mb-6 2xl:mb-8 text-primary">Our Core Services</h2>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl text-foreground/70 max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl mx-auto px-2">
                Comprehensive IT solutions designed specifically for the hospitality and business sectors
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 lg:gap-8 2xl:gap-10 3xl:gap-12">
              {services.map((service, index) => (
                <Card key={index} className="shadow-subtle hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="p-3 xs:p-4 sm:p-6 lg:p-8 2xl:p-10 3xl:p-12">
                    <div className="mb-2 xs:mb-3 sm:mb-4 lg:mb-6">{React.cloneElement(service.icon, { className: "h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14 3xl:h-16 3xl:w-16 4xl:h-20 4xl:w-20 text-secondary" })}</div>
                    <CardTitle className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl text-primary leading-tight">{service.title}</CardTitle>
                    <CardDescription className="text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl 4xl:text-2xl hidden xs:block">{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12 lg:mt-16 2xl:mt-20 3xl:mt-24">
              <Button size="lg" variant="outline" className="2xl:text-xl 2xl:px-8 2xl:py-6 3xl:text-2xl 3xl:px-10 3xl:py-8 4xl:text-3xl 4xl:px-12 4xl:py-10" asChild>
                <Link to="/services">
                  View All Services
                  <ArrowRight className="ml-2 h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-8 3xl:w-8" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mascot Section */}
        <section 
          className="relative py-8 xs:py-10 sm:py-16 md:py-20 lg:py-28 2xl:py-36 3xl:py-44 4xl:py-52 min-h-[150px] xs:min-h-[180px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[350px] 2xl:min-h-[450px] 3xl:min-h-[550px] 4xl:min-h-[700px] bg-cover xs:bg-contain bg-center xs:bg-right bg-no-repeat"
          style={{ 
            backgroundImage: `url(${mascotBanner})`,
            backgroundColor: '#0a1628'
          }}
        >
          <div className="container mx-auto px-3 xs:px-4 max-w-7xl 3xl:max-w-[1800px] 4xl:max-w-[2400px]">
            <div className="max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-bold text-white mb-2 xs:mb-3 sm:mb-4 lg:mb-6 2xl:mb-8">
                Powered by Innovation
              </h2>
              <p className="text-white/90 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl leading-relaxed">
                Like a stallion in full stride, we deliver powerful IT solutions with speed, precision, and reliability.
              </p>
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-16 lg:py-20 2xl:py-28 3xl:py-36 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl 3xl:max-w-[1800px] 4xl:max-w-[2400px]">
            <div className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto">
              <div className="text-center mb-12 lg:mb-16 2xl:mb-20 3xl:mb-24">
                <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold mb-4 lg:mb-6 2xl:mb-8 text-primary">Why Choose Stallion?</h2>
                <p className="text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl text-foreground/70">
                  We emphasize understanding client objectives and use technology to streamline operations
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 2xl:gap-10 3xl:gap-12">
                {features.map((feature, index) => (
                  <Card key={index} className="shadow-subtle">
                    <CardContent className="p-6 lg:p-8 2xl:p-10 3xl:p-12 flex items-start">
                      <CheckCircle2 className="h-6 w-6 lg:h-8 lg:w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 text-secondary mr-3 lg:mr-4 2xl:mr-5 flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80 lg:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">{feature}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Certifications & Awards */}
        <Certifications />

        {/* Featured Project */}
        <section className="py-12 sm:py-16 lg:py-20 2xl:py-28 3xl:py-36">
          <div className="container mx-auto px-4 max-w-7xl 3xl:max-w-[1800px] 4xl:max-w-[2400px]">
            <div className="max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto">
              <div className="text-center mb-12 lg:mb-16 2xl:mb-20">
                <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold mb-4 lg:mb-6 text-primary">Featured Project</h2>
                <p className="text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl text-foreground/70">Recent success story from 2023-24</p>
              </div>
              <Card className="shadow-medium">
                <CardHeader className="lg:p-8 2xl:p-10 3xl:p-12">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <CardTitle className="text-2xl lg:text-3xl 2xl:text-4xl 3xl:text-5xl text-primary">Elements by Rosetta - Varca Goa</CardTitle>
                    <Badge variant="secondary" className="lg:text-base 2xl:text-lg 3xl:text-xl lg:px-4 lg:py-1">2023</Badge>
                  </div>
                  <CardDescription className="text-base lg:text-lg 2xl:text-xl 3xl:text-2xl">
                    A beautiful 76-room property at Varca launched in November 2023, featuring our complete High Tech IT setup
                  </CardDescription>
                </CardHeader>
                <CardContent className="lg:px-8 2xl:px-10 3xl:px-12 lg:pb-8 2xl:pb-10 3xl:pb-12">
                  <div className="grid md:grid-cols-2 gap-4 lg:gap-6 2xl:gap-8 mb-6 lg:mb-8 2xl:mb-10">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 2xl:h-8 2xl:w-8 text-secondary mr-2 lg:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm lg:text-base 2xl:text-lg 3xl:text-xl">Complete network design & implementation</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 2xl:h-8 2xl:w-8 text-secondary mr-2 lg:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm lg:text-base 2xl:text-lg 3xl:text-xl">IP-based CCTV integration</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 2xl:h-8 2xl:w-8 text-secondary mr-2 lg:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm lg:text-base 2xl:text-lg 3xl:text-xl">High-speed Giga WiFi systems</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 2xl:h-8 2xl:w-8 text-secondary mr-2 lg:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm lg:text-base 2xl:text-lg 3xl:text-xl">Firewall security setup</span>
                    </div>
                  </div>
                  <Button className="2xl:text-lg 2xl:px-6 2xl:py-3 3xl:text-xl 3xl:px-8 3xl:py-4" asChild>
                    <Link to="/projects">
                      View All Projects
                      <ArrowRight className="ml-2 h-5 w-5 2xl:h-6 2xl:w-6" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 lg:py-20 2xl:py-28 3xl:py-36 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl 3xl:max-w-[1800px] 4xl:max-w-[2400px]">
            <div className="text-center mb-12 lg:mb-16 2xl:mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold mb-4 lg:mb-6 text-primary">Client Testimonials</h2>
              <p className="text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl text-foreground/70">
                Hear from our satisfied clients about their experience with Stallion IT Solutions
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 2xl:gap-12 3xl:gap-16 max-w-6xl 2xl:max-w-7xl 3xl:max-w-[1600px] mx-auto">
              <Card className="shadow-medium">
                <CardContent className="p-8 lg:p-10 2xl:p-12 3xl:p-14">
                  <div className="mb-6 lg:mb-8 2xl:mb-10">
                    <svg className="h-8 w-8 lg:h-10 lg:w-10 2xl:h-12 2xl:w-12 3xl:h-14 3xl:w-14 text-secondary/40 mb-4 lg:mb-6" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-foreground/80 italic text-sm lg:text-base 2xl:text-lg 3xl:text-xl leading-relaxed">
                      "For over 10 years, Stallion IT Solutions and Services has been our trusted technology partner, managing the complete IT infrastructure of our office, including a network of 50+ computers, servers, and CCTV systems. Their professionalism, reliability, and fast response have always stood out. A special mention to Mr. Tukaram Kunkalikar, whose experience and expertise in servers, networking, and CCTV setups have kept our operations running smoothly."
                    </p>
                  </div>
                  <div className="flex items-center">
                    {sachinImage ? (
                      <img
                        src={sachinImage}
                        alt="Mr Sachin Patil"
                        className="w-12 h-12 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-full mr-4 lg:mr-5 border-2 border-secondary object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-full bg-secondary/20 flex items-center justify-center mr-4 lg:mr-5 text-secondary font-bold lg:text-lg 2xl:text-xl">
                        SP
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-primary lg:text-lg 2xl:text-xl 3xl:text-2xl">Mr Sachin Patil</p>
                      <p className="text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-foreground/70">Rubiq Solutions Pvt. Ltd</p>
                      <Badge variant="secondary" className="mt-1 text-xs lg:text-sm 2xl:text-base">IT Consultation for Office setup</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-medium">
                <CardContent className="p-8 lg:p-10 2xl:p-12 3xl:p-14">
                  <div className="mb-6 lg:mb-8 2xl:mb-10">
                    <svg className="h-8 w-8 lg:h-10 lg:w-10 2xl:h-12 2xl:w-12 3xl:h-14 3xl:w-14 text-secondary/40 mb-4 lg:mb-6" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-foreground/80 italic text-sm lg:text-base 2xl:text-lg 3xl:text-xl leading-relaxed">
                      "Stallion IT Solutions and Services has been an invaluable IT partner for Insignia Group, supporting our real estate office and multiple client projects with complete reliability and professionalism. Their expertise in network design, CCTV setups, automation systems, and IT infrastructure for new apartment projects has helped us execute our work seamlessly and efficiently."
                    </p>
                  </div>
                  <div className="flex items-center">
                    {ravishImage ? (
                      <img
                        src={ravishImage}
                        alt="Mr. Ravish Tople"
                        className="w-12 h-12 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-full mr-4 lg:mr-5 border-2 border-secondary object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-full bg-secondary/20 flex items-center justify-center mr-4 lg:mr-5 text-secondary font-bold lg:text-lg 2xl:text-xl">
                        RT
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-primary lg:text-lg 2xl:text-xl 3xl:text-2xl">Mr. Ravish Tople</p>
                      <p className="text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-foreground/70">Insignia Group</p>
                      <Badge variant="secondary" className="mt-1 text-xs lg:text-sm 2xl:text-base">Network Design</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 2xl:py-28 3xl:py-36 hero-gradient text-primary-foreground">
          <div className="container mx-auto px-4 max-w-7xl 3xl:max-w-[1800px] 4xl:max-w-[2400px]">
            <div className="max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold mb-6 lg:mb-8 2xl:mb-10">Ready to Transform Your IT Infrastructure?</h2>
              <p className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl mb-8 lg:mb-10 2xl:mb-12 text-primary-foreground/90">
                Book your free IT audit today and discover how we can help your business thrive
              </p>
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 2xl:gap-8 justify-center">
                <Button size="lg" variant="secondary" className="lg:text-lg lg:px-8 lg:py-6 2xl:text-xl 2xl:px-10 2xl:py-7 3xl:text-2xl 3xl:px-12 3xl:py-8" asChild>
                  <Link to="/contact">Book Free Audit</Link>
                </Button>
                <Button size="lg" variant="secondary" className="lg:text-lg lg:px-8 lg:py-6 2xl:text-xl 2xl:px-10 2xl:py-7 3xl:text-2xl 3xl:px-12 3xl:py-8" asChild>
                  <a href="tel:+917875811148">
                    <Phone className="h-5 w-5 lg:h-6 lg:w-6 2xl:h-7 2xl:w-7 mr-2" />
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
