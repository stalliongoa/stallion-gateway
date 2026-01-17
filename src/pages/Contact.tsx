import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera, FileText, Shield, Mail, MapPin, Phone, CheckCircle } from "lucide-react";
import horseBodyMascot from "@/assets/horse-body-mascot.png";

const Contact = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    service: "",
    message: "",
  });

  const services = useMemo(
    () => [
      "IT Network Design",
      "CCTV Surveillance",
      "WiFi Setup",
      "IT AMC",
      "Server Setup",
      "IT Training",
      "Hardware Sales",
      "Other",
    ],
    []
  );

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

    try {
      console.log("Submitting audit request:", formData);

      const { data, error } = await supabase.functions.invoke("send-audit-request", {
        body: formData,
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

      setFormSubmitted(true);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        location: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit audit request:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly at info@stallion.co.in",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      <Navigation />

      <main className="flex-1 relative overflow-hidden">
        {/* Starfield/particle background effect */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" />
        <div 
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(205,170,125,0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 30%, rgba(205,170,125,0.1) 0%, transparent 40%),
                              radial-gradient(circle at 60% 80%, rgba(205,170,125,0.08) 0%, transparent 35%)`
          }}
        />

        <div className="relative z-10">
          {/* ===== HERO SECTION ===== */}
          <section className="pt-8 sm:pt-12 lg:pt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Heading */}
                  <header>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight text-white">
                      Get in Touch with
                      <br />
                      <span className="text-secondary">Stallion IT Solutions</span>{" "}
                      <span className="text-white">&amp; Services</span>
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-white/80">
                      We're here to answer your IT, CCTV, Support, and AMC queries.
                    </p>
                  </header>

                  {/* Reach Out Card */}
                  <Card className="rounded-2xl border-0 shadow-xl bg-white/[0.97]">
                    <CardContent className="p-5 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-bold text-[#0d1f3c]">Reach Out to Us</h2>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        We're here for your IT support, CCTV queries, AMC plans,
                        <br className="hidden sm:block" />
                        and more. Let's take your technology further.
                      </p>

                      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Name"
                          className="h-10 rounded-lg border-gray-200 bg-gray-50/80 text-sm"
                        />
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Email"
                          className="h-10 rounded-lg border-gray-200 bg-gray-50/80 text-sm"
                        />
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="Phone"
                          className="h-10 rounded-lg border-gray-200 bg-gray-50/80 text-sm"
                        />
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Message"
                          rows={3}
                          className="rounded-lg border-gray-200 bg-gray-50/80 text-sm resize-none"
                        />
                        <Button
                          type="submit"
                          className="w-full h-11 rounded-full bg-secondary hover:bg-secondary/90 text-[#0d1f3c] font-semibold text-sm"
                        >
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Mascot */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="relative w-full max-w-md xl:max-w-lg">
                    <img
                      src={horseBodyMascot}
                      alt="Stallion mascot"
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== CTA STRIP ===== */}
          <section className="py-6 sm:py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto h-11 px-6 rounded-full bg-white/95 hover:bg-white text-[#0d1f3c] border-0 shadow-lg font-medium text-sm"
                >
                  <Link to="/contact" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Book Your Free IT Audit
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto h-11 px-6 rounded-full bg-white/95 hover:bg-white text-[#0d1f3c] border-0 shadow-lg font-medium text-sm"
                >
                  <Link to="/amc-plans" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    View AMC Plans
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto h-11 px-6 rounded-full bg-white/95 hover:bg-white text-[#0d1f3c] border-0 shadow-lg font-medium text-sm"
                >
                  <Link to="/stallion-cctv" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Stallion CCTV
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* ===== CONTACT FORM SECTION ===== */}
          <section className="py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
                {/* Left - Contact Form Card */}
                <Card className="rounded-2xl border-0 shadow-xl bg-white/[0.97]">
                  <CardContent className="p-5 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0d1f3c]">Contact Form</h2>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Name"
                        className="h-10 rounded-lg border-gray-200 bg-gray-50/80 text-sm"
                      />
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Email"
                        className="h-10 rounded-lg border-gray-200 bg-gray-50/80 text-sm"
                      />
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91.22 Phone"
                        className="h-10 rounded-lg border-gray-200 bg-gray-50/80 text-sm"
                      />
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows={4}
                        className="rounded-lg border-gray-200 bg-gray-50/80 text-sm resize-none"
                      />
                      <Button
                        type="submit"
                        className="w-full h-11 rounded-full bg-secondary hover:bg-secondary/90 text-[#0d1f3c] font-semibold text-sm"
                      >
                        Send Message
                      </Button>

                      {formSubmitted && (
                        <p className="flex items-center justify-center gap-2 text-sm text-green-600 pt-1">
                          <CheckCircle className="h-4 w-4" />
                          Thank you for contacting us!
                        </p>
                      )}
                    </form>
                  </CardContent>
                </Card>

                {/* Right - Mascot with floating icons */}
                <div className="hidden lg:flex items-center justify-center relative">
                  <div className="relative w-full max-w-sm xl:max-w-md">
                    {/* Floating icons */}
                    <div className="absolute top-1/4 right-0 translate-x-4 bg-secondary/90 rounded-full p-3 shadow-lg">
                      <Phone className="h-5 w-5 text-[#0d1f3c]" />
                    </div>
                    <div className="absolute top-1/2 right-8 translate-x-6 bg-white/90 rounded-full p-3 shadow-lg">
                      <Mail className="h-5 w-5 text-[#0d1f3c]" />
                    </div>
                    <div className="absolute bottom-1/4 right-4 translate-x-2 bg-secondary/90 rounded-full p-3 shadow-lg">
                      <MapPin className="h-5 w-5 text-[#0d1f3c]" />
                    </div>

                    <img
                      src={horseBodyMascot}
                      alt="Stallion mascot"
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== CONTACT INFO + MAP ===== */}
          <section className="pb-12 sm:pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                {/* Left - Contact Information */}
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-secondary" />
                    Contact Information
                  </h2>

                  <div className="space-y-3">
                    <a
                      href="tel:+917875811148"
                      className="flex items-center gap-3 text-white/90 hover:text-secondary transition-colors text-sm sm:text-base"
                    >
                      <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span>+91 22 1234 5678</span>
                    </a>
                    <a
                      href="mailto:info@stallion.co.in"
                      className="flex items-center gap-3 text-white/90 hover:text-secondary transition-colors text-sm sm:text-base"
                    >
                      <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span>info@stallion.co.in</span>
                    </a>
                  </div>
                </div>

                {/* Right - Map */}
                <Card className="rounded-2xl overflow-hidden shadow-xl border-0 bg-white/[0.97]">
                  <CardContent className="p-0 relative">
                    <a
                      href="https://maps.google.com/?q=The+Yellow+House+Socorro+Porvorim+Goa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 left-3 z-10 bg-white/95 hover:bg-white px-3 py-1.5 rounded-md text-xs text-[#0d1f3c] font-medium shadow transition-colors"
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
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
