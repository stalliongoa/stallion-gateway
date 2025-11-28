import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Target, Users, Award } from "lucide-react";
import founderImage from "@/assets/founder-image.jpg";

const About = () => {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-secondary" />,
      title: "Our Mission",
      description: "To empower businesses through strategic, cutting-edge IT solutions that drive growth, efficiency, and resilience in an ever-evolving digital landscape."
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-secondary" />,
      title: "Quality Focus",
      description: "We emphasize understanding client objectives and use technology to streamline operations, improve reporting and support business planning."
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: "Client-Centric",
      description: "Building lasting partnerships with our clients, understanding their unique needs, and evolving alongside them as a strategic ally."
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      title: "Excellence",
      description: "Delivering exceptional service with a team of experts who are passionate about technological innovation and client satisfaction."
    }
  ];

  const milestones = [
    { number: "10+", label: "Years in IT Industry" },
    { number: "100+", label: "IT AMC Clients" },
    { number: "1000+", label: "CCTV Setups" },
    { number: "50+", label: "Hotel Networks Designed" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Stallion IT Solutions</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                Your trusted IT partner since 2012, delivering excellence in hospitality technology solutions
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-medium">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-primary">Our Story</h2>
                  <div className="space-y-4 text-foreground/80">
                    <p>
                      Since our inception in 2012, STALLION has been at the forefront of providing exceptional IT consultation services tailored to the unique needs of our clients in the hotel and industrial sectors. We specialize in offering comprehensive solutions for CCTV and network support, helping businesses enhance security, streamline operations, and stay technologically resilient.
                    </p>
                    <p>
                      At STALLION, our commitment to excellence is the driving force behind everything we do. We understand the critical role that technology plays in the modern business landscape, especially in industries like hospitality and manufacturing. With a customer-centric approach, we strive to exceed expectations and deliver solutions that empower our clients to thrive in a rapidly evolving digital world.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Milestones</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <Card key={index} className="text-center shadow-subtle hover:shadow-gold transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-secondary mb-2">{milestone.number}</div>
                    <div className="text-sm text-foreground/70">{milestone.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="shadow-subtle hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">{value.title}</h3>
                    <p className="text-foreground/70">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Message */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-medium">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-primary">Founder's Message</h2>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 flex-shrink-0">
                      <img 
                        src={founderImage} 
                        alt="Rajvaibhav Parulekar - Founder" 
                        className="w-full rounded-lg shadow-medium object-cover aspect-square"
                      />
                    </div>
                    <div className="md:w-2/3 space-y-4 text-foreground/80">
                      <p className="italic">
                        "As the proud founder of Stallion, I am thrilled to reflect on a remarkable journey that began in 2012, a journey marked by a decade of unwavering commitment to excellence in the realm of IT consultation."
                      </p>
                      <p>
                        Over the past ten years, we have evolved into a beacon of technological innovation, providing invaluable services to major hotels and industries across the vibrant landscape of Goa. Our mission has always been clear – to empower businesses with cutting-edge IT solutions that not only meet but exceed expectations.
                      </p>
                      <p>
                        We take pride in the expertise we bring to the table, derived from years of hands-on experience and a commitment to staying at the forefront of technological advancements. Looking ahead, we are excited about the future possibilities as we continue to evolve, adapt, and lead the way in shaping the digital landscape.
                      </p>
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="font-semibold text-primary">Rajvaibhav Parulekar</p>
                        <p className="text-sm text-foreground/70">Founder, Stallion IT Solutions & Services</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Meet Our Team Leads</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="shadow-subtle hover:shadow-medium transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Tukaram Kunkalikar</h3>
                  <p className="text-sm text-secondary font-medium mb-2">Project Head - Team Lead</p>
                  <p className="text-sm text-foreground/70">20+ years experience in IT field</p>
                </CardContent>
              </Card>

              <Card className="shadow-subtle hover:shadow-medium transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Rohit Toraskar</h3>
                  <p className="text-sm text-secondary font-medium mb-2">Sr. Regional IT Manager</p>
                  <p className="text-sm text-foreground/70">North Goa - 15 years experience</p>
                </CardContent>
              </Card>

              <Card className="shadow-subtle hover:shadow-medium transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Hafeel Mohammad</h3>
                  <p className="text-sm text-secondary font-medium mb-2">Sr. Regional IT Manager</p>
                  <p className="text-sm text-foreground/70">South Goa - 10 years experience</p>
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

export default About;
