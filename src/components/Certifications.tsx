import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Shield, CheckCircle2, Star } from "lucide-react";

const Certifications = () => {
  const certifications = [
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

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Certifications & Partnerships
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Industry-recognized certifications and partnerships that demonstrate our commitment to excellence
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
};

export default Certifications;
