import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import stallionLogo from "@/assets/stallion-logo.png";
import HorseMascot from "@/components/HorseMascot";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={stallionLogo} alt="Stallion IT" className="h-12 w-12" />
              <div>
                <div className="text-lg font-bold">STALLION</div>
                <div className="text-xs text-secondary">IT Solutions & Services</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted IT partner for hotels, resorts, and businesses in Goa since 2012.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-sm hover:text-secondary transition-colors">Services</Link></li>
              <li><Link to="/amc-plans" className="text-sm hover:text-secondary transition-colors">AMC Plans</Link></li>
              <li><Link to="/projects" className="text-sm hover:text-secondary transition-colors">Projects</Link></li>
              <li><Link to="/careers" className="text-sm hover:text-secondary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary">Our Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>IT Network Design</li>
              <li>CCTV Surveillance</li>
              <li>WiFi Setups</li>
              <li>IT AMC Services</li>
              <li>IT Training</li>
              <li>Hardware Sales</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
                <span>The Yellow House, Socorro, Porvorim, Goa 403521</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-5 w-5 text-secondary" />
                <a href="tel:+917875811148" className="hover:text-secondary transition-colors">+91 7875811148</a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-5 w-5 text-secondary" />
                <a href="mailto:info@stallion.co.in" className="hover:text-secondary transition-colors">info@stallion.co.in</a>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="flex items-center space-x-4 mt-6">
              <a href="https://www.facebook.com/stallionitsolutions" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/stallionitsolutions" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/stallionitsolutions" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Mascot */}
        <div className="border-t border-border/20 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Stallion IT Solutions & Services. All rights reserved.
            </p>
            {/* Footer Mascot - calm, guardian mode */}
            <HorseMascot variant="footer" className="opacity-50 hover:opacity-70 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
