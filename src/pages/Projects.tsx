import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, CheckCircle2 } from "lucide-react";
import ourProjectsHeroBanner from "@/assets/our-projects-hero-banner.jpg";

const Projects = () => {
  const projects = [
    {
      name: "Elements by Rosetta",
      location: "Varca, Goa",
      year: "2023",
      type: "Luxury Resort",
      rooms: "76 Rooms",
      description: "A beautiful 76-room property at Varca launched in November 2023, providing us an opportunity to design its High Tech IT setup.",
      services: [
        "Complete network design and implementation",
        "IP-based CCTV integration and execution",
        "EPABX and AYS service integration",
        "Firewall security implementation",
        "High-speed Giga WiFi systems",
        "LAN connectivity infrastructure",
        "Powerful server setup and licensing"
      ],
      highlights: "Delivered much before the launch date with comprehensive IT infrastructure"
    },
    {
      name: "Regenta Centra Imperial by Royal Orchid",
      location: "Candolim, Goa",
      year: "2023",
      type: "Hotel",
      rooms: "Multiple",
      description: "Having a long-term relation with Royal Orchid Group, we were glad to execute their latest property at Candolim, Goa.",
      services: [
        "Complete IT infrastructure planning",
        "Network design and execution",
        "CCTV surveillance system",
        "WiFi infrastructure",
        "Server and backup systems",
        "Integration with existing systems"
      ],
      highlights: "Executed in a record time of 30 days meeting all planned specifications"
    }
  ];

  const capabilities = [
    {
      title: "Network Planning",
      description: "Over 50 IT network planning and execution projects for new resorts and hotels",
      icon: <Building2 className="h-8 w-8 text-secondary" />
    },
    {
      title: "CCTV Expertise",
      description: "Successfully deployed 1000+ CCTV setups across diverse sectors",
      icon: <CheckCircle2 className="h-8 w-8 text-secondary" />
    },
    {
      title: "Long-term Partnerships",
      description: "Building lasting relationships with 100+ IT AMC clients since 2012",
      icon: <Calendar className="h-8 w-8 text-secondary" />
    }
  ];

  const clients = [
    "Granpa's Inn",
    "Bougainvillea Resort",
    "The Ocean Park Hotel & Resort",
    "The Flora Residency",
    "Highland Beach Resort",
    "The Boutique Hotel",
    "De Alturas Resorts",
    "Elements by Rosetta",
    "Regenta Centra Imperial"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section with Banner */}
        <section className="relative bg-[#0a1628] overflow-hidden">
          {/* Banner Background - Full Image No Cuts */}
          <div 
            className="w-full h-auto aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9] xl:aspect-[28/9] 3xl:aspect-[32/9] 4xl:aspect-[36/9] 5xl:aspect-[40/9] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${ourProjectsHeroBanner})` }}
          />
          
          {/* Text Overlay on Left */}
          <div className="absolute inset-0 flex items-center justify-start">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/50 to-transparent" />
            <div className="relative z-10 text-left pl-4 md:pl-8 lg:pl-12 xl:pl-16 3xl:pl-20 4xl:pl-28 5xl:pl-36 max-w-[200px] md:max-w-xs lg:max-w-sm xl:max-w-md 3xl:max-w-lg 4xl:max-w-xl 5xl:max-w-2xl">
              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl font-bold text-white mb-2 md:mb-3 lg:mb-4">
                <span className="text-[#c9a55c]">Our Projects</span>
              </h1>
              <p className="text-xs md:text-sm lg:text-base xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl text-white/90 leading-snug">
                Delivering excellence in IT infrastructure across Goa's hospitality sector
              </p>
            </div>
          </div>
        </section>

        {/* Latest Deliveries */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-primary text-center">Latest Deliveries 2023-24</h2>
              <p className="text-center text-foreground/70 mb-12">
                2023-24 was a memorable year for Stallion as we successfully executed two mega hotel projects much before the launch date.
              </p>
              
              <div className="space-y-8">
                {projects.map((project, index) => (
                  <Card key={index} className="shadow-medium hover:shadow-gold transition-shadow">
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <CardTitle className="text-2xl text-primary mb-2">{project.name}</CardTitle>
                          <CardDescription className="text-base">
                            <span className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              {project.location}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{project.year}</Badge>
                          <Badge variant="outline">{project.rooms}</Badge>
                        </div>
                      </div>
                      <p className="text-foreground/80">{project.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h4 className="font-semibold text-primary mb-3">Services Delivered:</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {project.services.map((service, idx) => (
                            <div key={idx} className="flex items-start text-sm">
                              <CheckCircle2 className="h-4 w-4 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-foreground/70">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm font-medium text-primary">
                          <CheckCircle2 className="h-4 w-4 inline mr-2 text-secondary" />
                          {project.highlights}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Capabilities</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {capabilities.map((capability, index) => (
                <Card key={index} className="shadow-subtle text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">{capability.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">{capability.title}</h3>
                    <p className="text-foreground/70">{capability.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Clients */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Valued Clients</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {clients.map((client, index) => (
                  <Card key={index} className="shadow-subtle hover:shadow-medium transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Building2 className="h-8 w-8 text-secondary mx-auto mb-3" />
                      <p className="font-medium text-primary">{client}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
