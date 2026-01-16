import { cn } from "@/lib/utils";
import horseMascotImage from "@/assets/horse-mascots.jpg";

interface HorseMascotProps {
  variant: 'header' | 'sidebar' | 'footer';
  className?: string;
}

const HorseMascot = ({ variant, className }: HorseMascotProps) => {
  const baseClasses = "pointer-events-none select-none";
  
  switch (variant) {
    case 'header':
      return (
        <div className={cn(baseClasses, "horse-mascot-header relative", className)}>
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-stallion-gold/30 rounded-full blur-lg animate-pulse-glow" />
          {/* Horse mascot image - header version (running pose) */}
          <div 
            className="relative w-14 h-8 md:w-16 md:h-10 overflow-hidden rounded animate-horse-head"
            style={{
              backgroundImage: `url(${horseMascotImage})`,
              backgroundPosition: 'top center',
              backgroundSize: '100% auto',
            }}
          />
        </div>
      );
      
    case 'sidebar':
      return (
        <div className={cn(baseClasses, "horse-mascot-sidebar relative", className)}>
          {/* Horse mascot image - sidebar version (standing pose) */}
          <div 
            className="relative w-16 h-24 overflow-hidden rounded animate-horse-body"
            style={{
              backgroundImage: `url(${horseMascotImage})`,
              backgroundPosition: 'center 45%',
              backgroundSize: '150% auto',
            }}
          />
          {/* Subtle glow on hover area */}
          <div className="absolute inset-0 bg-stallion-gold/20 rounded opacity-0 hover:opacity-100 transition-opacity blur-md" />
        </div>
      );
      
    case 'footer':
      return (
        <div className={cn(baseClasses, "horse-mascot-footer relative", className)}>
          {/* Horse mascot image - footer version (rearing pose) */}
          <div 
            className="relative w-20 h-14 overflow-hidden rounded opacity-70 animate-horse-rest"
            style={{
              backgroundImage: `url(${horseMascotImage})`,
              backgroundPosition: 'bottom center',
              backgroundSize: '100% auto',
            }}
          />
        </div>
      );
      
    default:
      return null;
  }
};

export default HorseMascot;
