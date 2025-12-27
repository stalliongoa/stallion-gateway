import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Clock, Users, MapPin, Award, Building } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  endValue: number;
  suffix: string;
  label: string;
}

const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: StatItem[] = [
    {
      icon: <Clock className="h-8 w-8 text-secondary" />,
      endValue: 10,
      suffix: "+",
      label: "Years Experience"
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      endValue: 100,
      suffix: "+",
      label: "AMC Clients"
    },
    {
      icon: <Camera className="h-8 w-8 text-secondary" />,
      endValue: 1000,
      suffix: "+",
      label: "CCTV Setups"
    },
    {
      icon: <Building className="h-8 w-8 text-secondary" />,
      endValue: 50,
      suffix: "+",
      label: "Hotels Served"
    },
    {
      icon: <MapPin className="h-8 w-8 text-secondary" />,
      endValue: 5,
      suffix: "+",
      label: "Cities Covered"
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      endValue: 24,
      suffix: "hr",
      label: "Response Time"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts(
        stats.map((stat) => Math.floor(stat.endValue * easeOut))
      );

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts(stats.map((stat) => stat.endValue));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Track Record</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Trusted by businesses across Goa and beyond for reliable IT solutions
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-primary-foreground/10 border-primary-foreground/20 text-center backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">
                  {counts[index]}
                  <span className="text-2xl">{stat.suffix}</span>
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
