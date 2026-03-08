import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Link, useNavigate } from "react-router-dom";

const menLinks = [
  { label: "T-Shirts", href: "/category/men?type=tshirt" },
  { label: "Hoodies", href: "/category/men?type=hoodie" },
  { label: "Joggers", href: "/category/men?type=jogger" },
  { label: "Jackets", href: "/category/men?type=jacket" },
  { label: "Shorts", href: "/category/men?type=shorts" },
  { label: "View All", href: "/category/men" },
];
const womenLinks = [
  { label: "Tops", href: "/category/women?type=top" },
  { label: "Dresses", href: "/category/women?type=dress" },
  { label: "Skirts", href: "/category/women?type=skirt" },
  { label: "Jackets", href: "/category/women?type=jacket" },
  { label: "Pants", href: "/category/women?type=pants" },
  { label: "View All", href: "/category/women" },
];

const StoreNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { totalItems, setIsOpen } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleMenuEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredMenu(menu);
  };
  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => setHoveredMenu(null), 150);
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5">
        <p className="font-body text-xs font-semibold tracking-wide">
          🚚 FREE SHIPPING on all orders above ₹399
        </p>
      </div>

      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl tracking-tight text-foreground shrink-0">
            DRIP<span className="text-primary">KART</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 ml-8">
            {[
              { label: "MEN", href: "/category/men", links: menLinks },
              { label: "WOMEN", href: "/category/women", links: womenLinks },
              { label: "ACCESSORIES", href: "/accessories", links: null },
              { label: "NEW DROPS", href: "/new-drops", links: null },
            ].map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.links && handleMenuEnter(item.label)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  to={item.href}
                  className="font-body text-sm font-bold tracking-wide text-foreground hover:text-primary px-3 py-4 inline-flex items-center gap-1 transition-colors"
                >
                  {item.label}
                  {item.links && <ChevronDown className="w-3 h-3" />}
                </Link>
                {item.links && hoveredMenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px] z-50"
                  >
                    {item.links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="block px-4 py-2 font-body text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                        onClick={() => setHoveredMenu(null)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Search bar desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-4 rounded-md border border-border bg-muted/50 font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
              />
            </form>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            <Link to="/profile" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-muted transition-colors">
              <User className="w-4 h-4 text-foreground" />
              <span className="font-body text-xs font-bold text-foreground">LOGIN</span>
            </Link>

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

            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-full hover:bg-muted transition-colors md:hidden">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border overflow-hidden bg-card"
            >
              <form onSubmit={handleSearch} className="px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search by products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-border bg-muted/50 font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden bg-card"
            >
              <ul className="flex flex-col px-4 py-4 gap-1">
                {[
                  { label: "MEN", href: "/category/men" },
                  { label: "WOMEN", href: "/category/women" },
                  { label: "ACCESSORIES", href: "/accessories" },
                  { label: "NEW DROPS", href: "/new-drops" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 px-2 font-body text-sm font-bold text-foreground hover:text-primary transition-colors border-b border-border/50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 flex gap-4">
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-body text-sm font-semibold text-foreground">
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-body text-sm font-semibold text-foreground">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default StoreNavbar;
