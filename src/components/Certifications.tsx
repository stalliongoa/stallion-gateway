import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Shield, CheckCircle2, Star } from "lucide-react";

const Certifications = () => {
  const certifications = [
    {
      icon: <Shield className="h-10 w-10 text-secondary" />,
      title: "ISO 9001:2015",
      description: "Quality Management System Certified",
      type: "Quality"
    },
    {
      icon: <Award className="h-10 w-10 text-secondary" />,
      title: "Hikvision Partner",
      description: "Authorized CCTV Installation Partner",
      type: "Partnership"
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-secondary" />,
      title: "CP Plus Certified",
      description: "Certified System Integrator",
      type: "Technical"
    },
    {
      icon: <Star className="h-10 w-10 text-secondary" />,
      title: "Microsoft Partner",
      description: "Authorized Solutions Provider",
      type: "Partnership"
    }
  ];

  const awards = [
    {
      year: "2023",
      title: "Best IT Service Provider",
      organization: "Goa Chamber of Commerce"
    },
    {
      year: "2022",
      title: "Excellence in Hospitality IT",
      organization: "Hotel Association of Goa"
    },
    {
      year: "2021",
      title: "Top 10 CCTV Installers",
      organization: "Security Industry Association"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Certifications & Awards
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Industry-recognized certifications and partnerships that demonstrate our commitment to excellence
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {certifications.map((cert, index) => (
            <Card key={index} className="text-center shadow-subtle hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">{cert.icon}</div>
                <Badge variant="secondary" className="mb-3">{cert.type}</Badge>
                <h3 className="font-bold text-primary mb-2">{cert.title}</h3>
                <p className="text-sm text-foreground/70">{cert.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Awards Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-primary">
            Recognition & Awards
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <Card key={index} className="shadow-subtle border-l-4 border-l-secondary">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-secondary text-secondary-foreground">
                    {award.year}
                  </Badge>
                  <h4 className="font-bold text-primary mb-2">{award.title}</h4>
                  <p className="text-sm text-foreground/70">{award.organization}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
