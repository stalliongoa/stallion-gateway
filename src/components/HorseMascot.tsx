import { cn } from "@/lib/utils";

interface HorseMascotProps {
  variant: 'header' | 'sidebar' | 'footer';
  className?: string;
}

// Since we have a composite image, we'll use CSS to show different parts
// In production, these would be separate SVG/PNG files
const HorseMascot = ({ variant, className }: HorseMascotProps) => {
  const baseClasses = "pointer-events-none select-none";
  
  switch (variant) {
    case 'header':
      return (
        <div className={cn(baseClasses, "horse-mascot-header", className)}>
          <div className="relative">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-stallion-gold/20 rounded-full blur-xl animate-pulse-glow" />
            {/* Horse silhouette with circuit animation */}
            <svg 
              viewBox="0 0 100 60" 
              className="w-16 h-10 md:w-20 md:h-12"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Digital horse head silhouette */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(43 65% 50%)" />
                  <stop offset="100%" stopColor="hsl(43 65% 70%)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Horse head outline */}
              <path 
                d="M75 10 C85 8, 95 15, 95 25 C95 35, 88 42, 80 45 L70 48 C65 50, 55 48, 50 45 L45 42 C40 40, 35 35, 35 28 L35 20 C35 12, 42 5, 52 5 L60 5 C65 5, 70 8, 75 10 Z"
                fill="url(#goldGradient)"
                opacity="0.9"
                filter="url(#glow)"
                className="animate-horse-head"
              />
              {/* Eye */}
              <circle 
                cx="72" 
                cy="22" 
                r="3" 
                fill="hsl(200 100% 60%)"
                className="animate-eye-glow"
              />
              {/* Circuit lines */}
              <path 
                d="M55 15 L65 15 L65 25 M60 30 L75 30 M50 35 L60 35 L60 40"
                stroke="hsl(200 100% 60%)"
                strokeWidth="1"
                fill="none"
                opacity="0.6"
                className="animate-circuit"
              />
              {/* Mane flowing */}
              <path 
                d="M45 5 C40 0, 30 5, 25 15 C20 25, 25 35, 30 40"
                stroke="url(#goldGradient)"
                strokeWidth="3"
                fill="none"
                opacity="0.8"
                className="animate-mane"
              />
            </svg>
          </div>
        </div>
      );
      
    case 'sidebar':
      return (
        <div className={cn(baseClasses, "horse-mascot-sidebar", className)}>
          <svg 
            viewBox="0 0 80 100" 
            className="w-12 h-16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="goldGradientSidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(43 65% 50%)" />
                <stop offset="100%" stopColor="hsl(43 65% 65%)" />
              </linearGradient>
            </defs>
            {/* Standing horse body */}
            <path 
              d="M40 10 C55 8, 65 15, 68 25 L70 35 C72 45, 68 55, 60 60 L55 70 L55 85 L50 90 L50 85 L45 70 L35 70 L30 85 L30 90 L25 85 L25 70 L20 60 C12 55, 8 45, 10 35 L12 25 C15 15, 25 8, 40 10 Z"
              fill="url(#goldGradientSidebar)"
              opacity="0.85"
              className="animate-horse-body"
            />
            {/* Eye */}
            <circle 
              cx="52" 
              cy="22" 
              r="2.5" 
              fill="hsl(200 100% 60%)"
              className="animate-eye-glow-slow"
            />
            {/* Circuit pattern */}
            <path 
              d="M30 25 L40 25 L40 35 M35 45 L50 45 L50 55"
              stroke="hsl(200 100% 60%)"
              strokeWidth="0.8"
              fill="none"
              opacity="0.5"
              className="animate-circuit-slow"
            />
          </svg>
        </div>
      );
      
    case 'footer':
      return (
        <div className={cn(baseClasses, "horse-mascot-footer", className)}>
          <svg 
            viewBox="0 0 120 80" 
            className="w-24 h-16 opacity-60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="goldGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(43 65% 45%)" />
                <stop offset="100%" stopColor="hsl(43 65% 55%)" />
              </linearGradient>
            </defs>
            {/* Resting horse - calm posture */}
            <path 
              d="M90 25 C100 22, 110 28, 112 38 L110 48 C108 55, 100 60, 90 58 L80 55 L75 65 L70 70 L68 65 L65 55 L55 55 L50 65 L48 70 L45 65 L45 55 L35 55 C25 55, 18 48, 15 38 L15 28 C18 18, 28 12, 45 15 L55 18 C65 20, 78 22, 90 25 Z"
              fill="url(#goldGradientFooter)"
              opacity="0.7"
              className="animate-horse-rest"
            />
            {/* Subtle eye */}
            <circle 
              cx="95" 
              cy="35" 
              r="2" 
              fill="hsl(200 100% 50%)"
              opacity="0.6"
            />
            {/* Tail movement */}
            <path 
              d="M20 45 C10 50, 5 60, 8 70"
              stroke="url(#goldGradientFooter)"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
              className="animate-tail"
            />
          </svg>
        </div>
      );
      
    default:
      return null;
  }
};

export default HorseMascot;
