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
import { Camera, FileText, Shield, Mail, MapPin, Phone } from "lucide-react";
import contactMockupBg from "@/assets/contactus-mockup.jpg";
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

    // Basic validation
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

      // Send email notification via edge function
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

      // Reset form
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
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 relative bg-primary text-primary-foreground overflow-hidden">
        {/* Blurred background texture from mockup (reference only) */}
        <img
          src={contactMockupBg}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-40"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-primary/60" />

        <div className="relative">
          {/* HERO: 2 columns */}
          <section className="pt-10 sm:pt-14 md:pt-16 lg:pt-20">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
                {/* Left: heading + description */}
                <div className="space-y-6">
                  <header className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                      Get in Touch with
                      <br />
                      <span className="text-secondary">Stallion IT Solutions</span> &amp; Services
                    </h1>
                    <p className="text-base sm:text-lg text-primary-foreground/90">
                      We're here to answer your IT, CCTV, Support, and AMC queries.
                    </p>
                  </header>

                  {/* Reach Out Card (white rounded) */}
                  <Card className="rounded-2xl border-0 shadow-medium bg-card/95 text-foreground">
                    <CardContent className="p-5 sm:p-6">
                      <div className="space-y-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-primary">Reach Out to Us</h2>
                        <p className="text-sm text-muted-foreground">
                          We're here for your IT support, CCTV queries, AMC plans, and more.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Name *"
                        />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Email *"
                        />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="Phone *"
                        />
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Message"
                          rows={4}
                          className="resize-none"
                        />

                        {/* Keep the additional fields (no logic changes) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Company / Property Name"
                          />
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Location"
                          />
                        </div>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Service Interest</option>
                          {services.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <Button type="submit" size="lg" className="w-full rounded-full">
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* CTA Row (gold strip with 3 buttons) */}
                  <div className="pt-2">
                    <div className="gold-gradient rounded-xl shadow-gold p-1">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          className="rounded-lg justify-start sm:justify-center text-secondary-foreground hover:bg-background/10"
                        >
                          <Link to="/contact" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Book Your Free IT Audit
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          className="rounded-lg justify-start sm:justify-center text-secondary-foreground hover:bg-background/10"
                        >
                          <Link to="/amc-plans" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            View AMC Plans
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          className="rounded-lg justify-start sm:justify-center text-secondary-foreground hover:bg-background/10"
                        >
                          <Link to="/stallion-cctv" className="flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Stallion CCTV
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: mascot visual container */}
                <div className="hidden lg:block">
                  <div className="rounded-2xl overflow-hidden shadow-medium bg-card/10 border border-primary-foreground/10">
                    <div className="h-[640px] relative flex items-center justify-end">
                      <img
                        src={horseBodyMascot}
                        alt="Stallion mascot"
                        className="h-full w-auto object-contain pr-6"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION: 2 columns */}
          <section className="py-10 sm:py-14 md:py-20">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
                {/* Left: Contact form white rounded */}
                <Card className="rounded-2xl border-0 shadow-medium bg-card/95 text-foreground">
                  <CardContent className="p-5 sm:p-6">
                    <h2 className="text-2xl font-bold text-primary">Contact Form</h2>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Name *"
                      />
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Email *"
                      />
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Phone *"
                      />
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows={4}
                        className="resize-none"
                      />

                      <Button type="submit" size="lg" className="w-full rounded-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Right: mascot panel */}
                <div className="hidden lg:block">
                  <div className="rounded-2xl overflow-hidden shadow-medium bg-card/10 border border-primary-foreground/10">
                    <div className="h-[520px] relative flex items-end justify-end">
                      <img
                        src={horseBodyMascot}
                        alt="Stallion mascot panel"
                        className="h-full w-auto object-contain pr-10 pb-4 opacity-95"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT INFO + MAP */}
          <section className="pb-12 sm:pb-16">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
                <Card className="rounded-2xl border-0 shadow-medium bg-card/95 text-foreground">
                  <CardContent className="p-5 sm:p-6">
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-secondary" />
                      Contact Information
                    </h2>

                    <div className="mt-5 space-y-3">
                      <a
                        className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                        href="tel:+917875811148"
                      >
                        <Phone className="h-5 w-5 text-secondary" />
                        <span>+91 7875811148</span>
                      </a>
                      <a
                        className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                        href="mailto:info@stallion.co.in"
                      >
                        <Mail className="h-5 w-5 text-secondary" />
                        <span>info@stallion.co.in</span>
                      </a>
                      <div className="text-sm text-muted-foreground">
                        The Yellow House, Socorro, Porvorim, Goa 403521
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl overflow-hidden shadow-medium border-0 bg-card/95">
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
