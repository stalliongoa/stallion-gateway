import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, FileText, Monitor, Camera, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";
import horseBodyMascot from "@/assets/horse-body-mascot.png";

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
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Animation hooks for different sections
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const formSectionAnimation = useScrollAnimation({ threshold: 0.1 });
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
      
      setIsSubmitted(true);
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

      // Reset submitted state after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
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

  const quickActions = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Book Your Free IT Audit",
      link: "/contact"
    },
    {
      icon: <Monitor className="h-5 w-5" />,
      label: "View AMC Plans",
      link: "/amc-plans"
    },
    {
      icon: <Camera className="h-5 w-5" />,
      label: "Stallion CCTV",
      link: "/stallion-cctv"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section with Mascot */}
        <section 
          ref={heroAnimation.ref}
          className={`relative min-h-[600px] md:min-h-[700px] overflow-hidden transition-all duration-700 ${
            heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #0d1f3c 100%)'
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <div className="absolute top-40 right-20 w-1 h-1 bg-amber-300 rounded-full animate-pulse delay-100" />
            <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse delay-200" />
            <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-300" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left side - Content */}
              <div className="space-y-8">
                {/* Hero Text */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Get in Touch with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                      Stallion IT Solutions
                    </span>{" "}
                    & Services
                  </h1>
                  <p className="text-white/80 text-base md:text-lg">
                    We're here to answer your IT, CCTV, Support, and AMC queries.
                  </p>
                </div>

                {/* Reach Out Form Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Reach Out to Us</h2>
                  <p className="text-gray-600 text-sm mb-6">
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
                        className="bg-gray-50 border-gray-200 rounded-lg h-12 text-gray-900 placeholder:text-gray-500"
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
                        className="bg-gray-50 border-gray-200 rounded-lg h-12 text-gray-900 placeholder:text-gray-500"
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
                        className="bg-gray-50 border-gray-200 rounded-lg h-12 text-gray-900 placeholder:text-gray-500"
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
                        className="bg-gray-50 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-semibold rounded-full h-12 text-base shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>

              {/* Right side - Mascot */}
              <div className="hidden lg:flex justify-end items-start">
                <div className="relative">
                  <img 
                    src={horseBodyMascot} 
                    alt="Stallion Mascot" 
                    className="h-[500px] xl:h-[600px] object-contain drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.3))'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-[#0a1628] py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-amber-400/50 text-white px-6 py-3 rounded-full transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <span className="text-amber-400">{action.icon}</span>
                  <span className="font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section 
          ref={formSectionAnimation.ref}
          className={`relative py-16 md:py-24 overflow-hidden transition-all duration-700 delay-200 ${
            formSectionAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)'
          }}
        >
          {/* Decorative stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-amber-400/50 rounded-full animate-pulse delay-150" />
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-300" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
              {/* Form Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Contact Form</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Name"
                      className="bg-gray-50 border-gray-200 rounded-lg h-12 text-gray-900 placeholder:text-gray-500"
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
                      className="bg-gray-50 border-gray-200 rounded-lg h-12 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91.22 Rebosso"
                      className="bg-gray-50 border-gray-200 rounded-lg h-12 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows={4}
                      className="bg-gray-50 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 resize-none"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-semibold rounded-full h-12 text-base shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40"
                  >
                    Send Message
                  </Button>
                  
                  {isSubmitted && (
                    <div className="flex items-center gap-2 text-emerald-600 justify-center pt-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Thank you for contacting us!</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Mascot with icons */}
              <div className="hidden lg:flex justify-center items-center relative">
                <div className="relative">
                  <img 
                    src={horseBodyMascot} 
                    alt="Stallion Mascot" 
                    className="h-[400px] xl:h-[450px] object-contain"
                    style={{
                      filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.25))'
                    }}
                  />
                  {/* Floating icons */}
                  <div className="absolute top-1/4 -left-8 bg-amber-400/20 backdrop-blur-sm p-3 rounded-full animate-bounce" style={{ animationDelay: '0s' }}>
                    <Phone className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="absolute top-1/2 -right-4 bg-amber-400/20 backdrop-blur-sm p-3 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}>
                    <Mail className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="absolute bottom-1/3 -left-4 bg-amber-400/20 backdrop-blur-sm p-3 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}>
                    <MapPin className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information & Map Section */}
        <section 
          ref={contactInfoAnimation.ref}
          className={`relative py-16 md:py-24 overflow-hidden transition-all duration-700 delay-300 ${
            contactInfoAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            background: 'linear-gradient(180deg, #0a1628 0%, #1a2744 100%)'
          }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-6xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-amber-400" />
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <a 
                    href="tel:+917875811148" 
                    className="flex items-center gap-4 text-white hover:text-amber-400 transition-colors group"
                  >
                    <div className="bg-amber-400/20 p-3 rounded-full group-hover:bg-amber-400/30 transition-colors">
                      <Phone className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="text-lg">+91 78758 11148</span>
                  </a>
                  
                  <a 
                    href="mailto:info@stallion.co.in" 
                    className="flex items-center gap-4 text-white hover:text-amber-400 transition-colors group"
                  >
                    <div className="bg-amber-400/20 p-3 rounded-full group-hover:bg-amber-400/30 transition-colors">
                      <Mail className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="text-lg">info@stallion.co.in</span>
                  </a>
                </div>

                {/* Mobile Mascot */}
                <div className="lg:hidden flex justify-center py-8">
                  <img 
                    src={horseBodyMascot} 
                    alt="Stallion Mascot" 
                    className="h-[250px] object-contain"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.2))'
                    }}
                  />
                </div>
              </div>

              {/* Map */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                    <span className="text-sm text-gray-600">View larger map</span>
                    <a 
                      href="https://maps.google.com/?q=Stallion+IT+Solutions+Socorro+Porvorim+Goa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-600 text-sm font-medium"
                    >
                      Open in Maps →
                    </a>
                  </div>
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
                  <div className="p-4 bg-white">
                    <p className="font-semibold text-gray-900">Stallion IT Solutions</p>
                    <p className="text-sm text-gray-600">The Yellow House, Socorro, Porvorim, Goa 403521</p>
                  </div>
                </div>
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
