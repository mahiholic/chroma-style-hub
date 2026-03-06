import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "MEN", href: "/category/men" },
  { label: "WOMEN", href: "/category/women" },
  { label: "ACCESSORIES", href: "#" },
  { label: "NEW DROPS", href: "#" },
];

const StoreNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-3xl tracking-tight text-foreground">
          DRIP<span className="text-primary">KART</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href}
                className="font-display text-lg tracking-wide text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {searchOpen && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="Search products..."
                autoFocus
              />
            )}
          </AnimatePresence>
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-muted transition-colors">
            <Search className="w-5 h-5 text-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors hidden sm:block">
            <Heart className="w-5 h-5 text-foreground" />
          </button>
          <button onClick={() => setIsOpen(true)} className="p-2 rounded-full hover:bg-muted transition-colors relative">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors hidden sm:block">
            <User className="w-5 h-5 text-foreground" />
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-full hover:bg-muted transition-colors md:hidden">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-card"
          >
            <ul className="flex flex-col px-4 py-4 gap-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} onClick={() => setMobileOpen(false)} className="font-display text-xl tracking-wide text-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default StoreNavbar;
