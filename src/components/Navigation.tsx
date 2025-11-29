import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import stallionLogo from "@/assets/stallion-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "AMC Plans", path: "/amc-plans" },
    { name: "Our Team", path: "/our-team" },
    { name: "Our Clients", path: "/our-clients" },
    { name: "Projects", path: "/projects" },
    { name: "CCTV", path: "/stallion-cctv" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between gap-4 h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img src={stallionLogo} alt="Stallion IT Solutions & Services" className="h-14 w-14" />
            <div className="hidden md:block">
              <div className="text-lg font-bold">STALLION</div>
              <div className="text-xs text-secondary">IT Solutions & Services</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium hover:text-secondary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <Button variant="secondary" size="sm" asChild>
              <Link to="/contact">Book Free Audit</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 text-sm font-medium hover:text-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="space-y-2 pt-4">
              <Button variant="secondary" size="sm" className="w-full" asChild>
                <Link to="/contact" onClick={() => setIsOpen(false)}>Book Free Audit</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
