import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

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
  const contactInfoAnimation = useScrollAnimation({ threshold: 0.1 });
  const formAnimation = useScrollAnimation({ threshold: 0.1 });
  const mapAnimation = useScrollAnimation({ threshold: 0.1 });

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

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-secondary" />,
      title: "Phone",
      content: "+91 7875811148",
      link: "tel:+917875811148"
    },
    {
      icon: <Mail className="h-6 w-6 text-secondary" />,
      title: "Email",
      content: "info@stallion.co.in",
      link: "mailto:info@stallion.co.in"
    },
    {
      icon: <MapPin className="h-6 w-6 text-secondary" />,
      title: "Address",
      content: "The Yellow House, Socorro, Porvorim, Goa 403521",
      link: "https://maps.google.com/?q=The+Yellow+House+Socorro+Porvorim+Goa"
    },
    {
      icon: <Clock className="h-6 w-6 text-secondary" />,
      title: "Business Hours",
      content: "Mon - Sat: 9:00 AM - 6:00 PM",
      link: null
    }
  ];

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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          ref={heroAnimation.ref}
          className={`hero-gradient text-primary-foreground py-12 sm:py-16 md:py-20 transition-all duration-700 ${
            heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Get in Touch</h1>
              <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 px-4">
                Book your free IT audit or discuss your technology needs with our experts
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section 
          ref={contactInfoAnimation.ref}
          className={`py-8 sm:py-12 md:py-16 bg-muted/30 transition-all duration-700 delay-200 ${
            contactInfoAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {contactInfo.map((info, index) => (
                <Card 
                  key={index} 
                  className={`shadow-subtle hover:shadow-medium transition-all duration-500 ${
                    contactInfoAnimation.isVisible 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">{info.icon}</div>
                    <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">{info.title}</h3>
                    {info.link ? (
                      <a 
                        href={info.link} 
                        className="text-xs sm:text-sm text-foreground/70 hover:text-secondary transition-colors break-words"
                        target={info.link.startsWith('http') ? '_blank' : undefined}
                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-xs sm:text-sm text-foreground/70">{info.content}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section 
          ref={formAnimation.ref}
          className={`py-8 sm:py-12 md:py-16 transition-all duration-700 delay-300 ${
            formAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-medium">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl text-primary">Book Your Free IT Audit</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="name" className="text-sm sm:text-base">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-sm sm:text-base">Company / Property Name</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your company"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm sm:text-base">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="+91 XXXXX XXXXX"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="location" className="text-sm sm:text-base">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, State"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="service" className="text-sm sm:text-base">Service Interest</Label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange as any}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm mt-1"
                        >
                          <option value="">Select a service</option>
                          {services.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm sm:text-base">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your IT requirements..."
                        rows={5}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button type="submit" size="lg" className="flex-1 w-full sm:w-auto">
                        Submit Request
                      </Button>
                      <Button type="button" size="lg" variant="secondary" asChild className="flex-1 w-full sm:w-auto">
                        <a href="https://wa.me/917875811148" target="_blank" rel="noopener noreferrer">
                          WhatsApp Us
                        </a>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section 
          ref={mapAnimation.ref}
          className={`py-8 sm:py-12 md:py-16 bg-muted/30 transition-all duration-700 delay-400 ${
            mapAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-primary">Find Us</h2>
              <Card className="shadow-medium overflow-hidden">
                <CardContent className="p-0">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
