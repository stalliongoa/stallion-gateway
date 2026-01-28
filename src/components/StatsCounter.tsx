import React, { useEffect, useState, useRef } from "react";
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
      endValue: 14,
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
    <section ref={sectionRef} className="py-16 lg:py-20 2xl:py-28 3xl:py-36 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 max-w-7xl 3xl:max-w-[1800px] 4xl:max-w-[2400px]">
        <div className="text-center mb-12 lg:mb-16 2xl:mb-20 3xl:mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold mb-4 lg:mb-6 2xl:mb-8">Our Track Record</h2>
          <p className="text-primary-foreground/80 max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl mx-auto lg:text-lg 2xl:text-xl 3xl:text-2xl">
            Trusted by businesses across Goa and beyond for reliable IT solutions
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8 2xl:gap-10 3xl:gap-12">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-primary-foreground/10 border-primary-foreground/20 text-center backdrop-blur-sm"
            >
              <CardContent className="p-6 lg:p-8 2xl:p-10 3xl:p-12">
                <div className="flex justify-center mb-3 lg:mb-4 2xl:mb-5">{React.cloneElement(stat.icon as React.ReactElement, { className: "h-8 w-8 lg:h-10 lg:w-10 2xl:h-12 2xl:w-12 3xl:h-14 3xl:w-14 text-secondary" })}</div>
                <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold text-secondary mb-1 lg:mb-2">
                  {counts[index]}
                  <span className="text-2xl lg:text-3xl 2xl:text-4xl 3xl:text-5xl">{stat.suffix}</span>
                </div>
                <div className="text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-primary-foreground/70">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
