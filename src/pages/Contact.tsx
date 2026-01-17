import { useMemo, useState } from "react";
import { CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import contactExact from "@/assets/contactus-exact.jpg";

/**
 * NOTE: This page is intentionally rendered to visually match the provided mockup exactly.
 * The mockup image is used as the visual layer, while real form inputs/buttons are overlaid
 * in the same positions to preserve existing submission logic.
 */
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
      // Send email notification via backend function
      const { data, error } = await supabase.functions.invoke("send-audit-request", {
        body: formData,
      });

      if (error) throw error;

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

  // Shared input styling to be visually invisible over the mock while still interactive.
  const overlayFieldClass =
    "w-full h-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none text-transparent placeholder:text-transparent";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* The mockup includes its own header/footer visuals; we keep the site footer below for consistency. */}
      <main className="flex-1">
        {/*
          The overlay uses a fixed aspect container that scales responsively.
          Image ratio is tall; we use the image itself to define height.
        */}
        <section className="py-0">
          <div className="mx-auto w-full max-w-[768px]">
            <div className="relative w-full">
              <img
                src={contactExact}
                alt="Contact page mockup"
                className="w-full h-auto block"
                decoding="async"
                loading="eager"
              />

              {/* ===== Overlay: HERO FORM (Reach Out to Us) =====
                  Positions are expressed as percentages of the image.
                  These were tuned to match the mockup layout.
              */}
              <form
                onSubmit={handleSubmit}
                className="absolute"
                style={{ left: "10%", top: "23.5%", width: "50%", height: "22%" }}
              >
                {/* Name */}
                <div className="absolute" style={{ left: "7%", top: "31%", width: "86%", height: "10%" }}>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Name"
                    className={overlayFieldClass}
                    aria-label="Name"
                  />
                </div>

                {/* Email */}
                <div className="absolute" style={{ left: "7%", top: "45%", width: "86%", height: "10%" }}>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                    className={overlayFieldClass}
                    aria-label="Email"
                  />
                </div>

                {/* Phone */}
                <div className="absolute" style={{ left: "7%", top: "59%", width: "86%", height: "10%" }}>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone"
                    className={overlayFieldClass}
                    aria-label="Phone"
                  />
                </div>

                {/* Message */}
                <div className="absolute" style={{ left: "7%", top: "73%", width: "86%", height: "17%" }}>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className={overlayFieldClass}
                    aria-label="Message"
                  />
                </div>

                {/* Send Message button */}
                <Button
                  type="submit"
                  variant="ghost"
                  className="absolute rounded-full"
                  style={{ left: "30%", top: "92%", width: "40%", height: "12%" }}
                  aria-label="Send Message"
                />
              </form>

              {/* ===== Overlay: CTA STRIP (3 buttons) ===== */}
              <div
                className="absolute"
                style={{ left: "10%", top: "49.5%", width: "80%", height: "4.8%" }}
              >
                <a
                  href="#"
                  className="absolute"
                  style={{ left: "0%", top: "0%", width: "33.3%", height: "100%" }}
                  aria-label="Book Your Free IT Audit"
                />
                <a
                  href="/amc-plans"
                  className="absolute"
                  style={{ left: "33.3%", top: "0%", width: "33.4%", height: "100%" }}
                  aria-label="View AMC Plans"
                />
                <a
                  href="/stallion-cctv"
                  className="absolute"
                  style={{ left: "66.7%", top: "0%", width: "33.3%", height: "100%" }}
                  aria-label="Stallion CCTV"
                />
              </div>

              {/* ===== Overlay: SECOND CONTACT FORM (Contact Form card) ===== */}
              <form
                onSubmit={handleSubmit}
                className="absolute"
                style={{ left: "10%", top: "56.8%", width: "55%", height: "23%" }}
              >
                <div className="absolute" style={{ left: "7%", top: "26%", width: "86%", height: "10%" }}>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Name"
                    className={overlayFieldClass}
                    aria-label="Name (contact form)"
                  />
                </div>

                <div className="absolute" style={{ left: "7%", top: "40%", width: "86%", height: "10%" }}>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                    className={overlayFieldClass}
                    aria-label="Email (contact form)"
                  />
                </div>

                <div className="absolute" style={{ left: "7%", top: "54%", width: "86%", height: "10%" }}>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone"
                    className={overlayFieldClass}
                    aria-label="Phone (contact form)"
                  />
                </div>

                <div className="absolute" style={{ left: "7%", top: "68%", width: "86%", height: "17%" }}>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    className={overlayFieldClass}
                    aria-label="Your Message (contact form)"
                  />
                </div>

                <Button
                  type="submit"
                  variant="ghost"
                  className="absolute rounded-full"
                  style={{ left: "30%", top: "88%", width: "40%", height: "12%" }}
                  aria-label="Send Message (contact form)"
                />

                {/* Thank-you line (only appears after submission; visually aligns with the mock) */}
                {formSubmitted ? (
                  <div
                    className="absolute"
                    style={{ left: "10%", top: "103%", width: "80%", height: "10%" }}
                  >
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Thank you for contacting us!</span>
                    </div>
                  </div>
                ) : null}
              </form>

              {/* Invisible anchors for contact info to keep behavior sensible */}
              <div
                className="absolute"
                style={{ left: "10%", top: "82.5%", width: "35%", height: "7%" }}
              >
                <a
                  href="tel:+917875811148"
                  className="absolute"
                  style={{ left: "0%", top: "22%", width: "100%", height: "22%" }}
                  aria-label="Call"
                />
                <a
                  href="mailto:info@stallion.co.in"
                  className="absolute"
                  style={{ left: "0%", top: "55%", width: "100%", height: "22%" }}
                  aria-label="Email"
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
