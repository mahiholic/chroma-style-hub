import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const StoreFooter = () => {
  return (
    <footer className="bg-foreground text-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-3xl mb-3">
              DRIP<span className="text-primary">KART</span>
            </h3>
            <p className="font-body text-sm text-card/60 leading-relaxed">
              India's favourite online fashion store. Bold designs, unbeatable prices, and trending styles — all in one place.
            </p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "SHOP", links: ["Men", "Women", "Accessories", "New Arrivals", "Sale"] },
            { title: "HELP", links: ["Track Order", "Returns", "FAQs", "Contact Us", "Size Guide"] },
            { title: "COMPANY", links: ["About Us", "Careers", "Blog", "Press", "Terms"] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-lg tracking-wider mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-body text-sm text-card/60 hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-card/10 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-card/40">
            © 2024 DripKart. All rights reserved. Made with 💛 in India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
