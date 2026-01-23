import { useState } from "react";
import { CheckCircle, Phone, Mail, MapPin, Clock, Building2 } from "lucide-react";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import stallionMascot from "@/assets/stallion-mascot-hero.png";

const Contact = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-audit-request", {
        body: formData,
      });
      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly at info@stallion.co.in",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section with Mascot Background */}
        <section className="relative min-h-[90vh] md:min-h-screen overflow-hidden">
          {/* Mascot Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${stallionMascot})` }}
          />
          
          {/* Navy Blue Overlay with Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/75 via-[#0a1628]/70 to-[#0a1628]/85" />
          
          {/* Edge Gradient Fades for Smooth Blending */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a1628] to-transparent" />
          
          {/* Content Layer */}
          <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 flex items-center justify-center min-h-[90vh] md:min-h-screen">
            <div className="w-full max-w-5xl">
              {/* Main Card - Semi-transparent White */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  {/* Left Side - Contact Form */}
                  <div className="p-8 md:p-10 lg:p-12">
                    <div className="mb-8">
                      <h1 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-3">
                        Get in <span className="text-[#c9a55c]">Touch</span>
                      </h1>
                      <p className="text-[#0a1628]/70 text-base md:text-lg">
                        Ready to transform your IT infrastructure? Let's discuss how Stallion can help your business grow.
                      </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0a1628] mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                            className="bg-[#f8f9fa] border-[#0a1628]/20 text-[#0a1628] placeholder:text-[#0a1628]/40 h-12 rounded-xl focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0a1628] mb-2">
                            Company Name
                          </label>
                          <Input
                            name="company"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Your Company"
                            className="bg-[#f8f9fa] border-[#0a1628]/20 text-[#0a1628] placeholder:text-[#0a1628]/40 h-12 rounded-xl focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                          />
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0a1628] mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@company.com"
                            required
                            className="bg-[#f8f9fa] border-[#0a1628]/20 text-[#0a1628] placeholder:text-[#0a1628]/40 h-12 rounded-xl focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0a1628] mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            required
                            className="bg-[#f8f9fa] border-[#0a1628]/20 text-[#0a1628] placeholder:text-[#0a1628]/40 h-12 rounded-xl focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#0a1628] mb-2">
                          How can we help you?
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us about your project or requirements..."
                          rows={4}
                          className="bg-[#f8f9fa] border-[#0a1628]/20 text-[#0a1628] placeholder:text-[#0a1628]/40 rounded-xl resize-none focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#c9a55c] to-[#e8c547] hover:from-[#b8944b] hover:to-[#d7b436] text-[#0a1628] font-bold h-14 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-base"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>

                    {formSubmitted && (
                      <div className="mt-5 flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <span className="text-green-700 font-medium">Thank you! We'll respond within 24 hours.</span>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Contact Details */}
                  <div className="bg-gradient-to-br from-[#0a1628] to-[#162d4a] p-8 md:p-10 lg:p-12 text-white">
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Contact <span className="text-[#c9a55c]">Information</span>
                      </h2>
                      <p className="text-white/70">
                        Your trusted IT partner for over 15 years. We're here to help.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <a
                        href="tel:+917875811148"
                        className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                          <Phone className="w-5 h-5 text-[#0a1628]" />
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Call Us</p>
                          <p className="text-white font-semibold text-lg">+91 78758 11148</p>
                        </div>
                      </a>

                      <a
                        href="mailto:info@stallion.co.in"
                        className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                          <Mail className="w-5 h-5 text-[#0a1628]" />
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Email Us</p>
                          <p className="text-white font-semibold text-lg">info@stallion.co.in</p>
                        </div>
                      </a>

                      <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-[#0a1628]" />
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Visit Us</p>
                          <p className="text-white font-semibold">
                            Stallion IT Solutions<br />
                            <span className="text-white/80 font-normal">Goa, India</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-[#0a1628]" />
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Business Hours</p>
                          <p className="text-white font-semibold">Mon - Sat: 9:00 AM - 6:00 PM</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] rounded-full flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-[#0a1628]" />
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Experience</p>
                          <p className="text-white font-semibold">15+ Years Serving Enterprises</p>
                        </div>
                      </div>
                    </div>

                    {/* Map Link */}
                    <div className="mt-8 pt-6 border-t border-white/20">
                      <a
                        href="https://maps.google.com/?q=Stallion+IT+Solutions+Goa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#c9a55c] hover:text-[#e8c547] transition-colors font-medium"
                      >
                        <MapPin className="w-4 h-4" />
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges Below Card */}
              <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-10">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[#c9a55c]">500+</p>
                  <p className="text-white/80 text-sm">Happy Clients</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[#c9a55c]">15+</p>
                  <p className="text-white/80 text-sm">Years Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[#c9a55c]">24/7</p>
                  <p className="text-white/80 text-sm">Support Available</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[#c9a55c]">100%</p>
                  <p className="text-white/80 text-sm">Client Satisfaction</p>
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
