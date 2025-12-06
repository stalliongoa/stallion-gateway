import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Phone, 
  Mail, 
  FileText, 
  Wrench,
  Building2,
  Hotel,
  Factory,
  Headphones,
  Camera
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import cctvAmcBg from "@/assets/cctv-amc-bg.jpeg";

const CCTVAmc = () => {
  const { toast } = useToast();
  const heroAnimation = useScrollAnimation();
  const introAnimation = useScrollAnimation();
  const scopeAnimation = useScrollAnimation();
  const plansAnimation = useScrollAnimation();
  const benefitsAnimation = useScrollAnimation();
  const formAnimation = useScrollAnimation();

  const [formData, setFormData] = useState({
    propertyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    propertyType: "",
    location: "",
    numberOfCameras: "",
    currentSystem: "",
    preferredPlan: "",
    message: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, consent: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please provide consent to be contacted.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.propertyName || !formData.contactPerson || !formData.email || !formData.phone) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-amc-enquiry", {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Enquiry Submitted!",
        description: "Thank you — we'll contact you within 24 hours to schedule an assessment.",
      });

      setFormData({
        propertyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        propertyType: "",
        location: "",
        numberOfCameras: "",
        currentSystem: "",
        preferredPlan: "",
        message: "",
        consent: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your enquiry. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scopeOfServices = [
    "Integration of new IP cameras into existing systems",
    "Scheduled monthly/periodic visits to inspect and maintain cameras and related equipment",
    "Preventive maintenance to reduce failures and downtime",
    "Rapid troubleshooting and resolution of camera faults and connectivity issues",
  ];

  const exclusions = [
    "Cable laying, pulling, drilling or any labor requiring an electrician",
    "Additional hardware (charged separately)",
  ];

  const plans = [
    {
      name: "Base Plan",
      price: "₹10,000",
      period: "year",
      visits: 8,
      description: "Best for small to medium installations",
      features: ["8 scheduled visits per year", "Regular maintenance checks", "Basic support"],
      popular: false,
    },
    {
      name: "Standard Plan",
      price: "₹15,000",
      period: "year",
      visits: 15,
      description: "Ideal for larger installations or where more frequent checks are required",
      features: ["15 scheduled visits per year", "Priority maintenance", "Extended support hours"],
      popular: true,
    },
    {
      name: "Premium Plan",
      price: "₹20,000",
      period: "year",
      visits: 24,
      description: "Maximum coverage with carry-forward flexibility",
      features: ["24 scheduled visits per year", "Unused visits carry forward", "Priority response", "Dedicated support"],
      popular: false,
    },
  ];

  const additionalBenefits = [
    "Detailed maintenance report after each visit",
    "Priority response for troubleshooting and support",
    "Option to integrate new cameras and upgrades (priced separately)",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <section className="relative min-h-[50vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cctvAmcBg})` }}></div>
        <div className="absolute inset-0 bg-slate-900/30"></div>
        <div className="container mx-auto px-4 relative z-10 py-20" ref={heroAnimation.ref}>
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center gap-4 mb-6">
              <Building2 className="w-8 h-8 text-primary" />
              <Hotel className="w-8 h-8 text-primary" />
              <Factory className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              CCTV Annual Maintenance Contract (AMC)
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-4">
              Housing Societies | Hotels | Industries
            </p>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto">
              Protect your investment. Reliable CCTV maintenance for round-the-clock surveillance — tailored plans for housing societies, hotels and industries.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background" ref={introAnimation.ref}>
        <div className={`container mx-auto px-4 transition-all duration-1000 ${introAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stallion IT Solutions and Services offers professional CCTV Annual Maintenance Contracts designed to keep your surveillance infrastructure running smoothly and reliably. Our AMC is ideal for housing societies, hotels and industrial facilities — providing scheduled preventive maintenance, fast troubleshooting and seamless integration of new equipment when needed.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30" ref={scopeAnimation.ref}>
        <div className={`container mx-auto px-4 transition-all duration-1000 ${scopeAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Scope of Services</h2>
            <div className="grid gap-4">
              {scopeOfServices.map((service, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border shadow-sm">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{service}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6 text-center text-muted-foreground">Exclusions</h3>
              <div className="grid gap-4">
                {exclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                    <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-foreground">{exclusion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background" ref={plansAnimation.ref}>
        <div className={`container mx-auto px-4 transition-all duration-1000 ${plansAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">AMC Plans</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Choose the plan that suits your property and get guaranteed peace of mind.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground"> / {plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.visits}</span>
                    <span className="text-muted-foreground"> visits/year</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30" ref={benefitsAnimation.ref}>
        <div className={`container mx-auto px-4 transition-all duration-1000 ${benefitsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Additional Benefits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {additionalBenefits.map((benefit, index) => {
                const icons = [FileText, Headphones, Camera];
                const Icon = icons[index];
                return (
                  <div key={index} className="bg-background p-6 rounded-xl border border-border text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-foreground">{benefit}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Secure Your Surveillance?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            Book an assessment or request a custom quote. Our team will help you choose the perfect plan for your property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="tel:+917875811148" className="flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-lg font-medium hover:bg-background/90 transition-colors">
              <Phone className="w-5 h-5" />
              +91 78758 11148
            </a>
            <a href="mailto:info@stallion.co.in" className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/30 px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/20 transition-colors">
              <Mail className="w-5 h-5" />
              info@stallion.co.in
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background" ref={formAnimation.ref}>
        <div className={`container mx-auto px-4 transition-all duration-1000 ${formAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <Wrench className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Enquire About CCTV AMC</h2>
              <p className="text-muted-foreground">Fill in the form below and we will get back to you within 24 hours.</p>
            </div>

            <Card>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="propertyName">Property / Company Name *</Label>
                      <Input
                        id="propertyName"
                        name="propertyName"
                        placeholder="e.g., Sapana Raj Valley"
                        value={formData.propertyName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        placeholder="Full name"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+91 7XXXXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type</Label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                      >
                        <option value="">Select type</option>
                        <option value="Housing Society">Housing Society</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Industry">Industry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfCameras">Number of Cameras (approx.)</Label>
                      <Input
                        id="numberOfCameras"
                        name="numberOfCameras"
                        placeholder="e.g., 20 / 64+"
                        value={formData.numberOfCameras}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentSystem">Current System</Label>
                      <select
                        id="currentSystem"
                        name="currentSystem"
                        value={formData.currentSystem}
                        onChange={handleChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                      >
                        <option value="">Select system type</option>
                        <option value="IP">IP</option>
                        <option value="Analog">Analog</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredPlan">Preferred Plan</Label>
                    <select
                      id="preferredPlan"
                      name="preferredPlan"
                      value={formData.preferredPlan}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                    >
                      <option value="">Select a plan</option>
                      <option value="Base">Base — ₹10,000/year</option>
                      <option value="Standard">Standard — ₹15,000/year</option>
                      <option value="Premium">Premium — ₹20,000/year</option>
                      <option value="Need help deciding">Need help deciding</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message / Requirements</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Any additional details or specific concerns"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                      I consent to be contacted by Stallion IT Solutions & Services.
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Request AMC Quote"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-center">
            <p className="text-muted-foreground">For immediate inquiries:</p>
            <a href="mailto:info@stallion.co.in" className="flex items-center gap-2 text-primary hover:underline">
              <Mail className="w-4 h-4" />
              info@stallion.co.in
            </a>
            <a href="tel:+917875811148" className="flex items-center gap-2 text-primary hover:underline">
              <Phone className="w-4 h-4" />
              +91 78758 11148
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CCTVAmc;
