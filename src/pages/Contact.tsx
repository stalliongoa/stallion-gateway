import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, FileText, Shield, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";
import mascotBanner from "@/assets/mascot-banner.jpg";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    service: "",
    message: ""
  });

  // Animation hooks for different sections
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const ctaAnimation = useScrollAnimation({ threshold: 0.1 });
  const formAnimation = useScrollAnimation({ threshold: 0.1 });
  const contactInfoAnimation = useScrollAnimation({ threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Submitting audit request:", formData);
      
      // Send email notification via edge function
      const { data, error } = await supabase.functions.invoke('send-audit-request', {
        body: formData
      });

      if (error) {
        console.error("Error sending audit request:", error);
        throw error;
      }

      console.log("Audit request sent successfully:", data);
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        location: "",
        service: "",
        message: ""
      });
    } catch (error) {
      console.error("Failed to submit audit request:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly at info@stallion.co.in",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const services = [
    "IT Network Design",
    "CCTV Surveillance",
    "WiFi Setup",
    "IT AMC",
    "Server Setup",
    "IT Training",
    "Hardware Sales",
    "Other"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section - Two Column */}
        <section 
          ref={heroAnimation.ref}
          className={`py-12 md:py-20 transition-all duration-700 ${
            heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column - Text & Form */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                    Get in Touch with<br />
                    <span className="text-secondary">Stallion IT Solutions</span> & Services
                  </h1>
                  <p className="text-white/80 text-lg">
                    We're here to answer your IT, CCTV, Support, and AMC queries.
                  </p>
                </div>

                {/* Reach Out Form Card */}
                <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-primary mb-2">Reach Out to Us</h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      We're here for your IT support, CCTV queries, AMC plans, and more. Let's take your technology further.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Name"
                          className="bg-gray-50 border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Email"
                          className="bg-gray-50 border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="Phone"
                          className="bg-gray-50 border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Message"
                          rows={3}
                          className="bg-gray-50 border-gray-200 rounded-lg resize-none"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold rounded-full py-6"
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Mascot Visual */}
              <div className="hidden lg:flex items-center justify-center h-full">
                <div 
                  className="w-full h-[600px] rounded-2xl bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${mascotBanner})` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Button Row */}
        <section 
          ref={ctaAnimation.ref}
          className={`py-6 transition-all duration-700 delay-100 ${
            ctaAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                asChild 
                variant="outline" 
                className="w-full sm:w-auto bg-white/95 hover:bg-white text-primary border-0 rounded-full px-8 py-6 font-semibold shadow-lg"
              >
                <Link to="/contact" className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Book Your Free IT Audit
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="w-full sm:w-auto bg-white/95 hover:bg-white text-primary border-0 rounded-full px-8 py-6 font-semibold shadow-lg"
              >
                <Link to="/amc-plans" className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  View AMC Plans
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="w-full sm:w-auto bg-white/95 hover:bg-white text-primary border-0 rounded-full px-8 py-6 font-semibold shadow-lg"
              >
                <Link to="/stallion-cctv" className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Stallion CCTV
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Form Section - Two Column */}
        <section 
          ref={formAnimation.ref}
          className={`py-12 md:py-16 transition-all duration-700 delay-200 ${
            formAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Contact Form */}
              <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">Contact Form</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Name"
                        className="bg-gray-50 border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Email"
                        className="bg-gray-50 border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91.22 phone"
                        className="bg-gray-50 border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows={4}
                        className="bg-gray-50 border-gray-200 rounded-lg resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold rounded-full py-6"
                    >
                      Send Message
                    </Button>
                    <p className="text-center text-sm text-green-600 flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      Thank you for contacting us!
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Right Column - Mascot Panel */}
              <div className="hidden lg:flex items-center justify-center h-full">
                <div 
                  className="w-full h-[500px] rounded-2xl bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${mascotBanner})` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information & Map Section */}
        <section 
          ref={contactInfoAnimation.ref}
          className={`py-12 md:py-16 transition-all duration-700 delay-300 ${
            contactInfoAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column - Contact Information */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-secondary" />
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  <a 
                    href="tel:+917875811148" 
                    className="flex items-center gap-4 text-white/90 hover:text-secondary transition-colors"
                  >
                    <Phone className="h-6 w-6 text-secondary" />
                    <span className="text-lg">+91 22 1234 5678</span>
                  </a>
                  <a 
                    href="mailto:info@stallion.co.in" 
                    className="flex items-center gap-4 text-white/90 hover:text-secondary transition-colors"
                  >
                    <Mail className="h-6 w-6 text-secondary" />
                    <span className="text-lg">info@stallion.co.in</span>
                  </a>
                </div>
              </div>

              {/* Right Column - Map */}
              <div className="w-full">
                <Card className="rounded-2xl overflow-hidden shadow-xl border-0">
                  <CardContent className="p-0">
                    <div className="relative">
                      <a 
                        href="https://maps.google.com/?q=The+Yellow+House+Socorro+Porvorim+Goa" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute top-4 left-4 z-10 bg-white/90 px-3 py-1 rounded text-sm text-primary hover:bg-white transition-colors"
                      >
                        View larger map
                      </a>
                      <div className="aspect-video w-full">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.3607829345937!2d73.82964!3d15.540620!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDMyJzI2LjIiTiA3M8KwNDknNDYuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Stallion IT Solutions Location"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
