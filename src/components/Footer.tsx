import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import stallionLogo from "@/assets/stallion-logo.png";
import footerBanner from "@/assets/footer-mascot-banner.jpg";

const Footer = () => {
  return (
    <footer 
      className="text-white overflow-x-hidden bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${footerBanner})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-primary/70 sm:bg-primary/60"></div>
      
      <div className="container mx-auto px-3 xs:px-4 py-8 xs:py-10 sm:py-12 max-w-7xl relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center space-x-2 xs:space-x-3 mb-3 xs:mb-4">
              <img src={stallionLogo} alt="Stallion IT" className="h-10 w-10 xs:h-12 xs:w-12" loading="lazy" />
              <div>
                <div className="text-base xs:text-lg font-bold">STALLION</div>
                <div className="text-[10px] xs:text-xs text-secondary">IT Solutions & Services</div>
              </div>
            </div>
            <p className="text-xs xs:text-sm text-white/80 mb-3 xs:mb-4 leading-relaxed">
              Your trusted IT partner for hotels, resorts, and businesses in Goa since 2012.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 xs:mb-3 sm:mb-4 text-secondary">Quick Links</h3>
            <ul className="space-y-1 xs:space-y-2">
              <li><Link to="/about" className="text-xs xs:text-sm text-white/80 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-xs xs:text-sm text-white/80 hover:text-secondary transition-colors">Services</Link></li>
              <li><Link to="/amc-plans" className="text-xs xs:text-sm text-white/80 hover:text-secondary transition-colors">AMC Plans</Link></li>
              <li><Link to="/projects" className="text-xs xs:text-sm text-white/80 hover:text-secondary transition-colors">Projects</Link></li>
              <li><Link to="/careers" className="text-xs xs:text-sm text-white/80 hover:text-secondary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-xs xs:text-sm text-white/80 hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 xs:mb-3 sm:mb-4 text-secondary">Our Services</h3>
            <ul className="space-y-1 xs:space-y-2 text-xs xs:text-sm text-white/80">
              <li>IT Network Design</li>
              <li>CCTV Surveillance</li>
              <li>WiFi Setups</li>
              <li>IT AMC Services</li>
              <li>IT Training</li>
              <li>Hardware Sales</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 xs:mb-3 sm:mb-4 text-secondary">Contact Us</h3>
            <ul className="space-y-2 xs:space-y-3">
              <li className="flex items-start space-x-2 text-xs xs:text-sm text-white/80">
                <MapPin className="h-4 w-4 xs:h-5 xs:w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>The Yellow House, Socorro, Porvorim, Goa 403521</span>
              </li>
              <li className="flex items-center space-x-2 text-xs xs:text-sm">
                <Phone className="h-4 w-4 xs:h-5 xs:w-5 text-secondary" />
                <a href="tel:+917875811148" className="text-white/80 hover:text-secondary transition-colors">+91 7875811148</a>
              </li>
              <li className="flex items-center space-x-2 text-xs xs:text-sm">
                <Mail className="h-4 w-4 xs:h-5 xs:w-5 text-secondary" />
                <a href="mailto:info@stallion.co.in" className="text-white/80 hover:text-secondary transition-colors">info@stallion.co.in</a>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="flex items-center space-x-3 xs:space-x-4 mt-4 xs:mt-6">
              <a href="https://www.facebook.com/stallionitsolutions" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-secondary transition-colors">
                <Facebook className="h-4 w-4 xs:h-5 xs:w-5" />
              </a>
              <a href="https://www.instagram.com/stallionitsolutions" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-secondary transition-colors">
                <Instagram className="h-4 w-4 xs:h-5 xs:w-5" />
              </a>
              <a href="https://www.linkedin.com/company/stallionitsolutions" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-secondary transition-colors">
                <Linkedin className="h-4 w-4 xs:h-5 xs:w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-6 xs:mt-8 pt-6 xs:pt-8 text-center">
          <p className="text-xs xs:text-sm text-white/70">
            © {new Date().getFullYear()} Stallion IT Solutions & Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
