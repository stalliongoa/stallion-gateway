import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const AMCPlans = () => {
  const plans = [
    {
      name: "Base Plan",
      code: "B",
      price: "₹5,000",
      period: "per month",
      visits: "4 fixed visits / week",
      extraVisit: "₹1,000 per visit",
      features: [
        "4 weekly visits by engineer",
        "Basic IT support",
        "Hardware troubleshooting",
        "Software assistance",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Standard Plan",
      code: "S",
      price: "₹8,000",
      period: "per month",
      visits: "8 fixed visits / week",
      extraVisit: "₹500 per visit",
      features: [
        "8 weekly visits by engineer",
        "Priority support",
        "Network maintenance",
        "CCTV monitoring",
        "Phone & email support",
        "Free IT consultation"
      ],
      popular: true
    },
    {
      name: "Standard Plus Plan",
      code: "SP",
      price: "₹10,000",
      period: "per month",
      visits: "12 fixed visits / week",
      extraVisit: "₹500 per visit",
      features: [
        "12 weekly visits by engineer",
        "Priority support 24/7",
        "2 month visit adjustments",
        "Comprehensive IT management",
        "Free staff training",
        "Backup engineer always available",
        "Holiday & Sunday support"
      ],
      popular: false
    },
    {
      name: "Premium Plan",
      code: "P",
      price: "₹30,000",
      period: "per month",
      visits: "Dedicated on-site engineer",
      extraVisit: "Included",
      features: [
        "Full-time resident engineer",
        "Immediate response",
        "Complete IT management",
        "Proactive monitoring",
        "Regular system audits",
        "Free equipment consultation",
        "Priority hardware procurement",
        "Comprehensive documentation"
      ],
      popular: false
    }
  ];

  const benefits = [
    "Continuous IT support irrespective of Sundays or holidays",
    "No dependency on IT resources - backup engineers always available",
    "Free IT consultation and training for staff",
    "Reduced internal IT personnel investment by up to 66%",
    "Dedicated account manager for each client",
    "Regular maintenance and preventive care"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">IT AMC Plans</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                Flexible Annual Maintenance Contracts designed for hospitality and business needs
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-foreground/80 mb-8">
                Since the inception of STALLION, we've introduced a special clubbed service package especially for hoteliers and businesses. 
                Outsource your IT Manager position to our professional team and reduce internal IT personnel investment by up to 66%.
              </p>
            </div>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative shadow-subtle hover:shadow-gold transition-all duration-300 ${
                    plan.popular ? 'ring-2 ring-secondary scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-secondary">{plan.code}</span>
                      </div>
                      <CardTitle className="text-2xl text-primary">{plan.name}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="text-3xl font-bold text-foreground">{plan.price}</div>
                        <div className="text-sm text-foreground/60">{plan.period}</div>
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 text-center">
                      <p className="font-semibold text-primary mb-1">{plan.visits}</p>
                      <p className="text-sm text-foreground/60">Extra visits: {plan.extraVisit}</p>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Check className="h-5 w-5 text-secondary mr-2 flex-shrink-0" />
                          <span className="text-foreground/70">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"} asChild>
                      <Link to="/contact">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-primary">Why Choose Our AMC Plans?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="shadow-subtle">
                    <CardContent className="p-6 flex items-start">
                      <Check className="h-6 w-6 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80">{benefit}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-primary">Need a Custom Plan?</h2>
              <p className="text-lg mb-8 text-foreground/70">
                We understand that every business has unique IT requirements. Contact us to discuss a tailored solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="default" asChild>
                  <Link to="/contact">Request Custom Quote</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <a href="tel:+917875811148">Call Us Now</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AMCPlans;
