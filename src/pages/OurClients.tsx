import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Hotel, Home, Briefcase } from "lucide-react";

const OurClients = () => {
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

  const testimonials = [
    {
      text: "For over 10 years, Stallion IT Solutions and Services has been our trusted technology partner, managing the complete IT infrastructure of our office, including a network of 50+ computers, servers, and CCTV systems. Their professionalism, reliability, and fast response have always stood out. A special mention to Mr. Tukaram Kunkalikar, whose experience and expertise in servers, networking, and CCTV setups have kept our operations running smoothly. His commitment and technical knowledge are truly exceptional. I would also like to appreciate Mr. Hafeel Mohammad for his prompt client support, honesty, and hands-on problem-solving. He has been the go-to engineer for our team and is known for his friendly and dependable service.",
      author: "Mr Sachin Patil",
      company: "Rubiq Solutions Pvt. Ltd",
      project: "IT Consultation for Office setup",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
    },
    {
      text: "Stallion IT Solutions and Services has been an invaluable IT partner for Insignia Group, supporting our real estate office and multiple client projects with complete reliability and professionalism. Their expertise in network design, CCTV setups, automation systems, and IT infrastructure for new apartment projects has helped us execute our work seamlessly and efficiently. They understand the unique needs of the real estate sector and consistently deliver high-quality, on-time solutions. Whether it is setting up secure networks, configuring surveillance systems, or managing automation requirements, the Stallion team has always exceeded our expectations. Their dedication, technical depth, and problem-solving mindset make them a trusted partner for any business looking for dependable IT services. I strongly recommend Stallion IT Solutions and Services for professional, long-term technology support.",
      author: "Mr. Ravish Tople",
      company: "Insignia Group",
      project: "Network Design",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop"
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
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="shadow-medium">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <svg className="h-8 w-8 text-secondary/40 mb-4" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-foreground/80 italic text-sm leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full mr-4 border-2 border-secondary"
                      />
                      <div>
                        <p className="font-bold text-primary">{testimonial.author}</p>
                        <p className="text-sm text-foreground/70">{testimonial.company}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">{testimonial.project}</Badge>
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
