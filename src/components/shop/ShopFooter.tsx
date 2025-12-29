import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export function ShopFooter() {
  return (
    <footer className="bg-shop-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-shop-orange mb-4">Shoppie Stallion</h3>
            <p className="text-sm text-gray-300 mb-4">
              Your trusted partner for enterprise electronics, CCTV systems, networking equipment, and IT infrastructure solutions in Goa and beyond.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-shop-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-shop-orange transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-shop-orange transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-shop-orange transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-shop-orange mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop/products" className="text-gray-300 hover:text-shop-orange transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop/category/cctv-surveillance" className="text-gray-300 hover:text-shop-orange transition-colors">
                  CCTV & Surveillance
                </Link>
              </li>
              <li>
                <Link to="/shop/category/networking-devices" className="text-gray-300 hover:text-shop-orange transition-colors">
                  Networking Devices
                </Link>
              </li>
              <li>
                <Link to="/shop/category/servers" className="text-gray-300 hover:text-shop-orange transition-colors">
                  Servers
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-shop-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-shop-orange transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-shop-orange mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop/account" className="text-gray-300 hover:text-shop-orange transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/shop/orders" className="text-gray-300 hover:text-shop-orange transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/shop/cart" className="text-gray-300 hover:text-shop-orange transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/amc-plans" className="text-gray-300 hover:text-shop-orange transition-colors">
                  AMC Plans
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-shop-orange transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-shop-orange mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-shop-orange flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Shop No. 10, Ground Floor, GSIDC Complex, EDC Patto, Panaji, Goa - 403001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-shop-orange flex-shrink-0" />
                <a href="tel:+918322513159" className="text-gray-300 hover:text-shop-orange transition-colors">
                  +91 832 251 3159
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-shop-orange flex-shrink-0" />
                <a href="mailto:info@stallion.co.in" className="text-gray-300 hover:text-shop-orange transition-colors">
                  info@stallion.co.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Shoppie Stallion. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="#" className="hover:text-shop-orange transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-shop-orange transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-shop-orange transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}