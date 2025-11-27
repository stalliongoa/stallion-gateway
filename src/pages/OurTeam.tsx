import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Linkedin } from "lucide-react";

const OurTeam = () => {
  const teamMembers = [
    {
      name: "Mr. Tukaram Kunkalikar",
      role: "Lead Technical Consultant",
      specialization: "Servers, Networking & CCTV",
      description: "With exceptional experience and expertise in servers, networking, and CCTV setups, Tukaram has been instrumental in keeping operations running smoothly for over 10 years.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
    },
    {
      name: "Mr. Hafeel Mohammad",
      role: "Senior Support Engineer",
      specialization: "Client Support & Problem Solving",
      description: "Known for prompt client support, honesty, and hands-on problem-solving, Hafeel is the go-to engineer for our team with his friendly and dependable service.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    },
    {
      name: "Technical Team",
      role: "Field Engineers",
      specialization: "Installation & Maintenance",
      description: "Our skilled field engineers handle on-site installations, maintenance, and support across all our client locations with professionalism and efficiency.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop"
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
                Our Team
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet the Experts Behind Your IT Success
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                Our experienced team of IT professionals brings over a decade of hospitality industry expertise to every project
              </p>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="shadow-medium hover:shadow-gold transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl"></div>
                        <img
                          src={member.image}
                          alt={member.name}
                          className="relative w-32 h-32 rounded-full object-cover border-4 border-secondary"
                        />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-primary mb-2">{member.name}</CardTitle>
                    <Badge variant="secondary" className="mb-2">{member.role}</Badge>
                    <CardDescription className="text-sm font-medium text-secondary">
                      {member.specialization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 text-center mb-4">
                      {member.description}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
                        <Phone className="h-5 w-5" />
                      </a>
                      <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
                        <Mail className="h-5 w-5" />
                      </a>
                      <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Our Core Values</h2>
                <p className="text-lg text-foreground/70">
                  What drives us to deliver excellence every day
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-subtle">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-primary mb-2">Excellence</h3>
                    <p className="text-sm text-foreground/70">
                      We strive for perfection in every installation and support interaction
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-subtle">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-xl font-bold text-primary mb-2">Reliability</h3>
                    <p className="text-sm text-foreground/70">
                      Our clients trust us with their critical IT infrastructure for good reason
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-subtle">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">💡</div>
                    <h3 className="text-xl font-bold text-primary mb-2">Innovation</h3>
                    <p className="text-sm text-foreground/70">
                      We stay ahead with the latest technologies and best practices
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Team CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Join Our Growing Team</h2>
              <p className="text-lg text-foreground/70 mb-8">
                We're always looking for talented IT professionals who share our passion for excellence
              </p>
              <Card className="shadow-medium bg-muted/50">
                <CardContent className="p-8">
                  <p className="text-foreground/80 mb-6">
                    If you're experienced in networking, CCTV systems, server management, or IT support and want to work with leading hospitality clients, we'd love to hear from you.
                  </p>
                  <a href="mailto:careers@stallionitsolutions.in" className="text-secondary hover:underline font-medium">
                    careers@stallionitsolutions.in
                  </a>
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

export default OurTeam;
