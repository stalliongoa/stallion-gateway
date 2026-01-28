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
      
      <div className="container mx-auto px-3 xs:px-4 py-8 xs:py-10 sm:py-12 lg:py-16 2xl:py-20 3xl:py-24 max-w-7xl 3xl:max-w-[1800px] 4xl:max-w-[2400px] relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 sm:gap-8 lg:gap-10 2xl:gap-12 3xl:gap-16">
          {/* Company Info */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center space-x-2 xs:space-x-3 mb-3 xs:mb-4 lg:mb-6">
              <img src={stallionLogo} alt="Stallion IT" className="h-10 w-10 xs:h-12 xs:w-12 lg:h-14 lg:w-14 2xl:h-16 2xl:w-16 3xl:h-20 3xl:w-20" loading="lazy" />
              <div>
                <div className="text-base xs:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold">STALLION</div>
                <div className="text-[10px] xs:text-xs lg:text-sm 2xl:text-base 3xl:text-lg text-secondary">IT Solutions & Services</div>
              </div>
            </div>
            <p className="text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/80 mb-3 xs:mb-4 lg:mb-6 leading-relaxed">
              Your trusted IT partner for hotels, resorts, and businesses in Goa since 2012.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold mb-2 xs:mb-3 sm:mb-4 lg:mb-6 text-secondary">Quick Links</h3>
            <ul className="space-y-1 xs:space-y-2 lg:space-y-3 2xl:space-y-4">
              <li><Link to="/about" className="text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/80 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/80 hover:text-secondary transition-colors">Services</Link></li>
              <li><Link to="/amc-plans" className="text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/80 hover:text-secondary transition-colors">AMC Plans</Link></li>
              <li><Link to="/projects" className="text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/80 hover:text-secondary transition-colors">Projects</Link></li>
              <li><Link to="/careers" className="text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/80 hover:text-secondary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/80 hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold mb-2 xs:mb-3 sm:mb-4 lg:mb-6 text-secondary">Our Services</h3>
            <ul className="space-y-1 xs:space-y-2 lg:space-y-3 2xl:space-y-4 text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/80">
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
            <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold mb-2 xs:mb-3 sm:mb-4 lg:mb-6 text-secondary">Contact Us</h3>
            <ul className="space-y-2 xs:space-y-3 lg:space-y-4 2xl:space-y-5">
              <li className="flex items-start space-x-2 lg:space-x-3 text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/80">
                <MapPin className="h-4 w-4 xs:h-5 xs:w-5 lg:h-6 lg:w-6 2xl:h-7 2xl:w-7 text-secondary flex-shrink-0 mt-0.5" />
                <span>The Yellow House, Socorro, Porvorim, Goa 403521</span>
              </li>
              <li className="flex items-center space-x-2 lg:space-x-3 text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl">
                <Phone className="h-4 w-4 xs:h-5 xs:w-5 lg:h-6 lg:w-6 2xl:h-7 2xl:w-7 text-secondary" />
                <a href="tel:+917875811148" className="text-white/80 hover:text-secondary transition-colors">+91 7875811148</a>
              </li>
              <li className="flex items-center space-x-2 lg:space-x-3 text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl">
                <Mail className="h-4 w-4 xs:h-5 xs:w-5 lg:h-6 lg:w-6 2xl:h-7 2xl:w-7 text-secondary" />
                <a href="mailto:info@stallion.co.in" className="text-white/80 hover:text-secondary transition-colors">info@stallion.co.in</a>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="flex items-center space-x-3 xs:space-x-4 lg:space-x-5 2xl:space-x-6 mt-4 xs:mt-6 lg:mt-8">
              <a href="https://www.facebook.com/stallionitsolutions" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-secondary transition-colors">
                <Facebook className="h-4 w-4 xs:h-5 xs:w-5 lg:h-6 lg:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8" />
              </a>
              <a href="https://www.instagram.com/stallionitsolutions" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-secondary transition-colors">
                <Instagram className="h-4 w-4 xs:h-5 xs:w-5 lg:h-6 lg:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8" />
              </a>
              <a href="https://www.linkedin.com/company/stallionitsolutions" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-secondary transition-colors">
                <Linkedin className="h-4 w-4 xs:h-5 xs:w-5 lg:h-6 lg:w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-6 xs:mt-8 lg:mt-12 2xl:mt-16 pt-6 xs:pt-8 lg:pt-10 2xl:pt-12 text-center">
          <p className="text-xs xs:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-white/70">
            © {new Date().getFullYear()} Stallion IT Solutions & Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
