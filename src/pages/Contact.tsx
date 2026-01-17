import { useState } from "react";
import { CheckCircle, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import stallionLogo from "@/assets/stallion-gold-logo.png";
import horseBodyMascot from "@/assets/horse-body-mascot.png";

const Contact = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form 1 - Reach Out
  const [reachOutData, setReachOutData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Form 2 - Contact Form
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleReachOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reachOutData.name || !reachOutData.email || !reachOutData.phone) {
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
        body: reachOutData,
      });
      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setReachOutData({ name: "", email: "", phone: "", message: "" });
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

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactFormData.name || !contactFormData.email || !contactFormData.phone) {
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
        body: contactFormData,
      });
      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormSubmitted(true);
      setContactFormData({ name: "", email: "", phone: "", message: "" });
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
        {/* Hero Section - Dark Navy Background */}
        <section className="relative bg-[#0a1628] overflow-hidden">
          {/* Decorative hexagon pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-[#c9a55c]/30 rotate-45" />
            <div className="absolute top-40 right-20 w-24 h-24 border border-[#c9a55c]/20 rotate-12" />
            <div className="absolute bottom-20 left-1/4 w-20 h-20 border border-[#c9a55c]/25 -rotate-12" />
          </div>

          <div className="container mx-auto px-4 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Side - Text + Form */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Contact <span className="text-[#c9a55c]">Us</span>
                  </h1>
                  <p className="text-gray-300 text-lg max-w-md">
                    Have questions about our IT services? We're here to help you find the perfect solution for your business.
                  </p>
                </div>

                {/* Reach Out Form Card */}
                <div className="bg-[#0d1f35] rounded-2xl p-6 md:p-8 border border-[#c9a55c]/20 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Reach Out to <span className="text-[#c9a55c]">Us</span>
                  </h2>
                  
                  <form onSubmit={handleReachOutSubmit} className="space-y-4">
                    <Input
                      name="name"
                      value={reachOutData.name}
                      onChange={(e) => setReachOutData({ ...reachOutData, name: e.target.value })}
                      placeholder="Your Name *"
                      required
                      className="bg-[#162d4a] border-[#c9a55c]/30 text-white placeholder:text-gray-400 h-12 rounded-lg focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                    />
                    <Input
                      name="email"
                      type="email"
                      value={reachOutData.email}
                      onChange={(e) => setReachOutData({ ...reachOutData, email: e.target.value })}
                      placeholder="Your Email *"
                      required
                      className="bg-[#162d4a] border-[#c9a55c]/30 text-white placeholder:text-gray-400 h-12 rounded-lg focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                    />
                    <Input
                      name="phone"
                      type="tel"
                      value={reachOutData.phone}
                      onChange={(e) => setReachOutData({ ...reachOutData, phone: e.target.value })}
                      placeholder="Your Phone *"
                      required
                      className="bg-[#162d4a] border-[#c9a55c]/30 text-white placeholder:text-gray-400 h-12 rounded-lg focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                    />
                    <Textarea
                      name="message"
                      value={reachOutData.message}
                      onChange={(e) => setReachOutData({ ...reachOutData, message: e.target.value })}
                      placeholder="Your Message"
                      rows={3}
                      className="bg-[#162d4a] border-[#c9a55c]/30 text-white placeholder:text-gray-400 rounded-lg resize-none focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#c9a55c] to-[#e8c547] hover:from-[#b8944b] hover:to-[#d7b436] text-[#0a1628] font-semibold h-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Right Side - Logo + Mascot */}
              <div className="relative flex flex-col items-center justify-center lg:pl-8">
                <img
                  src={stallionLogo}
                  alt="Stallion Logo"
                  className="w-48 md:w-64 lg:w-80 mb-6 drop-shadow-2xl"
                  loading="eager"
                />
                <img
                  src={horseBodyMascot}
                  alt="Stallion Mascot"
                  className="w-64 md:w-80 lg:w-96 drop-shadow-2xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Strip - Gold Background */}
        <section className="bg-gradient-to-r from-[#c9a55c] via-[#e8c547] to-[#c9a55c] py-4 md:py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <Link to="/services">
                <Button
                  variant="outline"
                  className="bg-[#0a1628] text-white border-[#0a1628] hover:bg-[#162d4a] hover:text-white px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 w-full md:w-auto"
                >
                  Book Your Free IT Audit
                </Button>
              </Link>
              <Link to="/amc-plans">
                <Button
                  variant="outline"
                  className="bg-[#0a1628] text-white border-[#0a1628] hover:bg-[#162d4a] hover:text-white px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 w-full md:w-auto"
                >
                  View AMC Plans
                </Button>
              </Link>
              <Link to="/stallion-cctv">
                <Button
                  variant="outline"
                  className="bg-[#0a1628] text-white border-[#0a1628] hover:bg-[#162d4a] hover:text-white px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 w-full md:w-auto"
                >
                  Stallion CCTV
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Second Section - Contact Form + Mascot */}
        <section className="relative bg-[#0d1f35] overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-10 w-16 h-16 border-2 border-[#c9a55c]/20 rounded-lg rotate-45" />
            <div className="absolute bottom-32 right-1/4 w-12 h-12 border-2 border-[#c9a55c]/15 rounded-lg -rotate-12" />
            <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-[#c9a55c]/10 rounded-lg rotate-12" />
          </div>

          <div className="container mx-auto px-4 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Side - Contact Form */}
              <div className="bg-[#0a1628] rounded-2xl p-6 md:p-8 border border-[#c9a55c]/20 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Contact <span className="text-[#c9a55c]">Form</span>
                </h2>
                
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <Input
                    name="name"
                    value={contactFormData.name}
                    onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                    placeholder="Your Name *"
                    required
                    className="bg-[#162d4a] border-[#c9a55c]/30 text-white placeholder:text-gray-400 h-12 rounded-lg focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                  />
                  <Input
                    name="email"
                    type="email"
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                    placeholder="Your Email *"
                    required
                    className="bg-[#162d4a] border-[#c9a55c]/30 text-white placeholder:text-gray-400 h-12 rounded-lg focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                  />
                  <Input
                    name="phone"
                    type="tel"
                    value={contactFormData.phone}
                    onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                    placeholder="Your Phone *"
                    required
                    className="bg-[#162d4a] border-[#c9a55c]/30 text-white placeholder:text-gray-400 h-12 rounded-lg focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                  />
                  <Textarea
                    name="message"
                    value={contactFormData.message}
                    onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                    placeholder="Your Message"
                    rows={4}
                    className="bg-[#162d4a] border-[#c9a55c]/30 text-white placeholder:text-gray-400 rounded-lg resize-none focus:border-[#c9a55c] focus:ring-[#c9a55c]"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#c9a55c] to-[#e8c547] hover:from-[#b8944b] hover:to-[#d7b436] text-[#0a1628] font-semibold h-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>

                {formSubmitted && (
                  <div className="mt-4 flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>Thank you for contacting us! We'll respond soon.</span>
                  </div>
                )}
              </div>

              {/* Right Side - Mascot with floating icons */}
              <div className="relative flex items-center justify-center">
                {/* Floating decorative icons */}
                <div className="absolute top-0 right-1/4 w-12 h-12 bg-[#c9a55c]/20 rounded-lg flex items-center justify-center animate-pulse">
                  <Phone className="w-6 h-6 text-[#c9a55c]" />
                </div>
                <div className="absolute bottom-1/4 left-0 w-12 h-12 bg-[#c9a55c]/20 rounded-lg flex items-center justify-center animate-pulse delay-300">
                  <Mail className="w-6 h-6 text-[#c9a55c]" />
                </div>
                <div className="absolute top-1/3 left-1/4 w-10 h-10 bg-[#c9a55c]/15 rounded-lg flex items-center justify-center animate-pulse delay-500">
                  <MapPin className="w-5 h-5 text-[#c9a55c]" />
                </div>
                
                <img
                  src={horseBodyMascot}
                  alt="Stallion Mascot"
                  className="w-64 md:w-80 lg:w-96 drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section - Contact Info + Map */}
        <section className="bg-[#0a1628] py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left - Contact Info */}
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Get in <span className="text-[#c9a55c]">Touch</span>
                </h2>
                
                <div className="space-y-6">
                  <a
                    href="tel:+917875811148"
                    className="flex items-center gap-4 p-4 bg-[#0d1f35] rounded-xl border border-[#c9a55c]/20 hover:border-[#c9a55c]/50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Call Us</p>
                      <p className="text-white text-lg font-semibold">+91 78758 11148</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@stallion.co.in"
                    className="flex items-center gap-4 p-4 bg-[#0d1f35] rounded-xl border border-[#c9a55c]/20 hover:border-[#c9a55c]/50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email Us</p>
                      <p className="text-white text-lg font-semibold">info@stallion.co.in</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 bg-[#0d1f35] rounded-xl border border-[#c9a55c]/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Visit Us</p>
                      <p className="text-white font-semibold">
                        Stallion IT Solutions<br />
                        Goa, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Map */}
              <div className="h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-[#c9a55c]/20 shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3845.8799900000003!2d73.8319!3d15.4909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDI5JzI3LjIiTiA3M8KwNDknNTQuOCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Stallion IT Solutions Location"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
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
