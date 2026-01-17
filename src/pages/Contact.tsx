import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      icon: <FileText className="h-4 w-4" />,
      label: "Book Your Free IT Audit",
      link: "/contact"
    },
    {
      icon: <Monitor className="h-4 w-4" />,
      label: "View AMC Plans",
      link: "/amc-plans"
    },
    {
      icon: <Camera className="h-4 w-4" />,
      label: "Stallion CCTV",
      link: "/stallion-cctv"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          ref={heroAnimation.ref}
          className={`relative overflow-hidden transition-all duration-700 ${
            heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #142238 40%, #0d1f3c 100%)'
          }}
        >
          {/* Decorative particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[10%] w-1 h-1 bg-amber-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-40 right-[20%] w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-32 left-[30%] w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[60%] right-[40%] w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute top-32 left-[50%] w-1 h-1 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
            <div className="absolute bottom-48 right-[15%] w-1 h-1 bg-amber-400/50 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left side - Content */}
              <div className="space-y-6 md:space-y-8 max-w-xl">
                {/* Hero Text */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.15] tracking-tight">
                    Get in Touch with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400">
                      Stallion IT Solutions
                    </span>{" "}
                    & Services
                  </h1>
                  <p className="text-white/70 text-base md:text-lg">
                    We're here to answer your IT, CCTV, Support, and AMC queries.
                  </p>
                </div>

                {/* Reach Out Form Card */}
                <div className="bg-white/[0.98] backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/30">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Reach Out to Us</h2>
                  <p className="text-gray-500 text-sm md:text-base mb-6 leading-relaxed">
                    We're here for your IT support, CCTV queries, AMC plans, and more. Let's take your technology further.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      id="hero-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Name"
                      className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20"
                    />
                    <Input
                      id="hero-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email"
                      className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20"
                    />
                    <Input
                      id="hero-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Phone"
                      className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20"
                    />
                    <Textarea
                      id="hero-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Message"
                      rows={3}
                      className="bg-gray-50 border-gray-200 rounded-lg text-base text-gray-900 placeholder:text-gray-400 resize-none focus:border-amber-400 focus:ring-amber-400/20"
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold rounded-full h-12 text-base shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02]"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>

              {/* Right side - Large Mascot */}
              <div className="hidden lg:flex justify-center lg:justify-end items-center min-h-[600px]">
                <img 
                  src={horseBodyMascot} 
                  alt="Stallion Mascot" 
                  className="h-[500px] xl:h-[580px] 2xl:h-[640px] object-contain drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 80px rgba(251, 191, 36, 0.3)) drop-shadow(0 25px 50px rgba(0,0,0,0.4))'
                  }}
                />
              </div>

              {/* Mobile Mascot */}
              <div className="lg:hidden flex justify-center pt-4">
                <img 
                  src={horseBodyMascot} 
                  alt="Stallion Mascot" 
                  className="h-[220px] sm:h-[280px] object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.25))'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions CTA Row */}
        <section className="bg-[#0d1a2d] py-6 md:py-8 border-y border-white/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="group flex items-center gap-3 bg-white/[0.95] text-gray-900 px-6 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 hover:scale-105 border border-gray-100"
                >
                  <span className="text-amber-500 group-hover:text-amber-600 transition-colors">{action.icon}</span>
                  <span className="font-semibold text-sm md:text-base">{action.label}</span>
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
            background: 'linear-gradient(180deg, #0a1628 0%, #0f1e32 50%, #0a1628 100%)'
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-24 left-[15%] w-1 h-1 bg-white/40 rounded-full animate-pulse" />
            <div className="absolute top-[40%] right-[20%] w-1.5 h-1.5 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="absolute bottom-32 left-[25%] w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center max-w-7xl mx-auto">
              {/* Form Card */}
              <div className="bg-white/[0.98] backdrop-blur-md rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl shadow-black/30">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Contact Form</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Name"
                    className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                    className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91.22 Rebosso"
                    className="bg-gray-50 border-gray-200 rounded-lg h-12 text-base text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={5}
                    className="bg-gray-50 border-gray-200 rounded-lg text-base text-gray-900 placeholder:text-gray-400 resize-none focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold rounded-full h-12 text-base shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02]"
                  >
                    Send Message
                  </Button>
                  
                  {isSubmitted && (
                    <div className="flex items-center gap-2 text-emerald-600 justify-center pt-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium text-base">Thank you for contacting us!</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Mascot with floating icons */}
              <div className="hidden lg:flex justify-center items-center relative">
                <div className="relative">
                  <img 
                    src={horseBodyMascot} 
                    alt="Stallion Mascot" 
                    className="h-[400px] xl:h-[480px] object-contain"
                    style={{
                      filter: 'drop-shadow(0 0 60px rgba(251, 191, 36, 0.25))'
                    }}
                  />
                  {/* Floating icons */}
                  <div 
                    className="absolute top-[15%] -left-4 bg-white/10 backdrop-blur-md p-4 rounded-full shadow-xl border border-white/20"
                    style={{ animation: 'bounce 3s ease-in-out infinite' }}
                  >
                    <Phone className="h-6 w-6 text-amber-400" />
                  </div>
                  <div 
                    className="absolute top-[50%] -right-4 bg-white/10 backdrop-blur-md p-4 rounded-full shadow-xl border border-white/20"
                    style={{ animation: 'bounce 3s ease-in-out infinite', animationDelay: '0.5s' }}
                  >
                    <Mail className="h-6 w-6 text-amber-400" />
                  </div>
                  <div 
                    className="absolute bottom-[20%] left-[10%] bg-white/10 backdrop-blur-md p-4 rounded-full shadow-xl border border-white/20"
                    style={{ animation: 'bounce 3s ease-in-out infinite', animationDelay: '1s' }}
                  >
                    <MapPin className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Mobile Mascot */}
              <div className="lg:hidden flex justify-center">
                <img 
                  src={horseBodyMascot} 
                  alt="Stallion Mascot" 
                  className="h-[200px] sm:h-[240px] object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.2))'
                  }}
                />
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
            background: 'linear-gradient(180deg, #0a1628 0%, #111d2e 100%)'
          }}
        >
          {/* Decorative particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-[15%] w-1 h-1 bg-amber-400/50 rounded-full animate-pulse" />
            <div className="absolute bottom-24 left-[20%] w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-start max-w-7xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-4">
                  <div className="bg-amber-400/20 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-amber-400" />
                  </div>
                  Contact Information
                </h2>
                
                <div className="space-y-5 pl-2">
                  <a 
                    href="tel:+917875811148" 
                    className="flex items-center gap-5 text-white/90 hover:text-amber-400 transition-colors group"
                  >
                    <div className="bg-white/5 group-hover:bg-amber-400/20 p-3 rounded-full transition-colors border border-white/10">
                      <Phone className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="text-lg">+91 22 1234 5678</span>
                  </a>
                  
                  <a 
                    href="mailto:info@stallion.co.in" 
                    className="flex items-center gap-5 text-white/90 hover:text-amber-400 transition-colors group"
                  >
                    <div className="bg-white/5 group-hover:bg-amber-400/20 p-3 rounded-full transition-colors border border-white/10">
                      <Mail className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="text-lg">info@stallion.co.in</span>
                  </a>
                </div>

                {/* Mobile Mascot for this section */}
                <div className="lg:hidden flex justify-center py-8">
                  <img 
                    src={horseBodyMascot} 
                    alt="Stallion Mascot" 
                    className="h-[180px] sm:h-[200px] object-contain"
                    style={{
                      filter: 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.2))'
                    }}
                  />
                </div>
              </div>

              {/* Map */}
              <div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">View larger map</span>
                    <a 
                      href="https://maps.google.com/?q=Stallion+IT+Solutions+Socorro+Porvorim+Goa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-600 text-sm font-medium transition-colors"
                    >
                      Open in Maps →
                    </a>
                  </div>
                  <div className="aspect-[4/3] w-full">
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
                  <div className="p-5 bg-white border-t border-gray-100">
                    <p className="font-semibold text-gray-900">Stallion IT Solutions</p>
                    <p className="text-sm text-gray-500 mt-1">The Yellow House, Socorro, Porvorim, Goa 403521</p>
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
