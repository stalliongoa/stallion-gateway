import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Hotel, Home, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  name: string;
  company: string | null;
  image_url: string | null;
  testimonial: string | null;
  rating: number;
}

const OurClients = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setClients(data);
    }
  };

  const clientCategories = [
    {
      icon: <Hotel className="h-12 w-12 text-secondary" />,
      title: "Hotels & Resorts",
      count: "50+",
      description: "Luxury properties and boutique hotels across Goa and Maharashtra",
      clients: ["Elements by Rosetta - Varca Goa", "Various 5-star properties", "Beach resorts", "Heritage hotels"]
    },
    {
      icon: <Building2 className="h-12 w-12 text-secondary" />,
      title: "Corporate Offices",
      count: "100+",
      description: "IT infrastructure for offices ranging from 10 to 100+ computers",
      clients: ["Rubiq Solutions Pvt. Ltd", "Insignia Group", "Real estate firms", "Professional services"]
    },
    {
      icon: <Home className="h-12 w-12 text-secondary" />,
      title: "Residential Complexes",
      count: "30+",
      description: "Smart home setups and security systems for apartments and villas",
      clients: ["Luxury apartments", "Gated communities", "Smart villas", "Residential towers"]
    },
    {
      icon: <Briefcase className="h-12 w-12 text-secondary" />,
      title: "SMBs",
      count: "80+",
      description: "Small and medium businesses across various industries",
      clients: ["Retail stores", "Restaurants", "Clinics", "Service businesses"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-secondary text-secondary-foreground">
                Our Clients
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Trusted by Leading Businesses
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                Over 200+ satisfied clients across hospitality, corporate, and residential sectors
              </p>
            </div>
          </div>
        </section>

        {/* Client Logos */}
        {clients.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Our Valued Clients</h2>
                <p className="text-lg text-foreground/70">
                  Proud to serve leading businesses and organizations
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
                {clients.filter(client => 
                  !client.name.toLowerCase().includes('sachin patil') && 
                  !client.name.toLowerCase().includes('ravish tople')
                ).map((client) => (
                  <Card key={client.id} className="shadow-subtle hover:shadow-gold transition-all duration-300 group">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[180px]">
                      {client.image_url ? (
                        <img
                          src={client.image_url}
                          alt={client.name}
                          className="h-16 w-auto object-contain mb-4 transition-all duration-300"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                          <span className="text-2xl font-bold text-secondary">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <p className="font-semibold text-sm text-primary">{client.name}</p>
                      {client.company && (
                        <p className="text-xs text-foreground/60 mt-1">{client.company}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Client Statistics */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {clientCategories.map((category, index) => (
                <Card key={index} className="shadow-medium hover:shadow-gold transition-all duration-300 text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">{category.icon}</div>
                    <CardTitle className="text-xl text-primary mb-2">{category.title}</CardTitle>
                    <div className="text-4xl font-bold text-secondary mb-2">{category.count}</div>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      {category.clients.map((client, idx) => (
                        <li key={idx}>• {client}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Client Testimonials</h2>
              <p className="text-lg text-foreground/70">
                Hear from our satisfied clients about their experience with Stallion IT Solutions
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {clients.filter(c => c.testimonial).map((client) => (
                <Card key={client.id} className="shadow-medium">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <svg className="h-8 w-8 text-secondary/40 mb-4" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-foreground/80 italic text-sm leading-relaxed">
                        {client.testimonial}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {client.image_url ? (
                        <img
                          src={client.image_url}
                          alt={client.name}
                          className="w-12 h-12 rounded-full mr-4 border-2 border-secondary object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full mr-4 border-2 border-secondary bg-secondary/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-secondary">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-primary">{client.name}</p>
                        {client.company && <p className="text-sm text-foreground/70">{client.company}</p>}
                        <div className="flex mt-1">
                          {[...Array(client.rating)].map((_, i) => (
                            <svg key={i} className="h-4 w-4 text-secondary fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Served */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Industries We Serve</h2>
              <p className="text-lg text-foreground/70 mb-12">
                Specialized IT solutions across diverse sectors
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "Hospitality",
                  "Real Estate",
                  "Healthcare",
                  "Retail",
                  "Education",
                  "Manufacturing",
                  "Professional Services",
                  "Construction"
                ].map((industry, index) => (
                  <Card key={index} className="shadow-subtle hover:shadow-gold transition-all">
                    <CardContent className="p-4 text-center">
                      <p className="font-medium text-primary">{industry}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Join Our Growing Client Base</h2>
              <p className="text-lg text-foreground/70 mb-8">
                Experience the same level of service and professionalism that our clients have trusted for over a decade
              </p>
              <Card className="shadow-medium bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8">
                  <p className="text-foreground/80 mb-6">
                    Book your free IT audit today and discover how we can help your business thrive with reliable IT infrastructure and support.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="/contact" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-btn font-medium hover:bg-secondary/90 transition-colors"
                    >
                      Book Free Audit
                    </a>
                    <a 
                      href="tel:+917875811148" 
                      className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-btn font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Call Us Now
                    </a>
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

export default OurClients;
