import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "MEN", href: "/category/men" },
  { label: "WOMEN", href: "/category/women" },
  { label: "ACCESSORIES", href: "/accessories" },
  { label: "NEW DROPS", href: "/new-drops" },
];

const StoreNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const navigate = useNavigate();

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
          <button onClick={() => navigate("/search")} className="p-2 rounded-full hover:bg-muted transition-colors">
            <Search className="w-5 h-5 text-foreground" />
          </button>
          <Link to="/wishlist" className="p-2 rounded-full hover:bg-muted transition-colors relative hidden sm:flex">
            <Heart className="w-5 h-5 text-foreground" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(true)} className="p-2 rounded-full hover:bg-muted transition-colors relative">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <Link to="/profile" className="p-2 rounded-full hover:bg-muted transition-colors hidden sm:flex">
            <User className="w-5 h-5 text-foreground" />
          </Link>
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
              <li>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="font-display text-xl tracking-wide text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Heart className="w-5 h-5" /> WISHLIST
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="font-display text-xl tracking-wide text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <User className="w-5 h-5" /> PROFILE
                </Link>
              </li>
              <li>
                <Link to="/search" onClick={() => setMobileOpen(false)} className="font-display text-xl tracking-wide text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Search className="w-5 h-5" /> SEARCH
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default StoreNavbar;
