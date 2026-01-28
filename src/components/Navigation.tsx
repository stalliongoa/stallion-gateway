import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import stallionLogo from "@/assets/stallion-gold-logo.png";
import SearchDialog from "@/components/SearchDialog";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-7xl 3xl:max-w-[1800px] 4xl:max-w-[2400px]">
        <div className="flex items-center justify-between gap-4 h-20 2xl:h-24 3xl:h-28 4xl:h-32">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 xs:space-x-3 flex-shrink-0">
            <img src={stallionLogo} alt="Stallion IT Solutions & Services" className="h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 2xl:h-16 2xl:w-16 3xl:h-20 3xl:w-20" loading="eager" />
            <div className="hidden sm:block">
              <div className="text-base sm:text-lg 2xl:text-xl 3xl:text-2xl font-bold">STALLION</div>
              <div className="text-[10px] sm:text-xs 2xl:text-sm 3xl:text-base text-secondary">IT Solutions & Services</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 2xl:space-x-8 3xl:space-x-10 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl font-medium hover:text-secondary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4 2xl:space-x-6 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-primary-foreground hover:text-secondary 2xl:h-12 2xl:w-12 3xl:h-14 3xl:w-14"
            >
              <Search className="h-4 w-4 2xl:h-5 2xl:w-5 3xl:h-6 3xl:w-6" />
            </Button>
            <Button variant="secondary" size="sm" className="2xl:text-base 2xl:px-6 2xl:py-3 3xl:text-lg 3xl:px-8 3xl:py-4" asChild>
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

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
};

export default Navigation;
