import { Instagram, Twitter, Youtube, Facebook, Truck, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const StoreFooter = () => {
  return (
    <footer className="bg-foreground text-card">
      {/* Trust badges */}
      <div className="border-b border-card/10">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            <span className="font-body text-sm text-card/80">15 Days Return Policy*</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-primary" />
            <span className="font-body text-sm text-card/80">Cash On Delivery*</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl mb-3">
              DRIP<span className="text-primary">KART</span>
            </h3>
            <p className="font-body text-xs text-card/50 leading-relaxed">
              India's favourite online fashion store. Bold designs, unbeatable prices, and trending styles.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-wider text-primary mb-4">CUSTOMER SERVICE</h4>
            <ul className="space-y-2">
              {["Contact Us", "Track Order", "Return Order", "Cancel Order"].map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-card/60 hover:text-card transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-wider text-primary mb-4">COMPANY</h4>
            <ul className="space-y-2">
              {["About Us", "Terms & Conditions", "Privacy Policy", "We are Hiring"].map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-card/60 hover:text-card transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-wider text-primary mb-4">CONNECT WITH US</h4>
            <div className="flex gap-3 mb-3">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-wider text-primary mb-4">SHOP</h4>
            <ul className="space-y-2">
              <li><Link to="/category/men" className="font-body text-sm text-card/60 hover:text-card transition-colors">Men</Link></li>
              <li><Link to="/category/women" className="font-body text-sm text-card/60 hover:text-card transition-colors">Women</Link></li>
              <li><Link to="/accessories" className="font-body text-sm text-card/60 hover:text-card transition-colors">Accessories</Link></li>
              <li><Link to="/new-drops" className="font-body text-sm text-card/60 hover:text-card transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-card/10 mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-card/40">
            © 2024 DripKart. All rights reserved. Made with 💛 in India.
          </p>
          <p className="font-body text-xs text-card/40">100% SECURE PAYMENTS</p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
