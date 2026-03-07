import { motion } from "framer-motion";
import { User, ShoppingBag, Heart, MapPin, Settings, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";

const menuItems = [
  { icon: ShoppingBag, label: "My Orders", desc: "Track, return, or buy things again", href: "#" },
  { icon: Heart, label: "My Wishlist", desc: "View your favourite items", href: "/wishlist" },
  { icon: MapPin, label: "Addresses", desc: "Save addresses for a hassle-free checkout", href: "#" },
  { icon: Settings, label: "Settings", desc: "Manage notifications, password & more", href: "#" },
];

const ProfilePage = () => {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 border border-border mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-foreground">GUEST USER</h1>
              <p className="font-body text-sm text-muted-foreground">Sign in to access your account</p>
            </div>
          </div>
          <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-display tracking-wide">
            <LogIn className="w-4 h-4" /> SIGN IN / REGISTER
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-4 border border-border text-center">
            <ShoppingBag className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-display text-2xl text-foreground">{totalItems}</p>
            <p className="font-body text-xs text-muted-foreground">Items in Bag</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl p-4 border border-border text-center">
            <Heart className="w-6 h-6 text-secondary mx-auto mb-1" />
            <p className="font-display text-2xl text-foreground">{wishlistCount}</p>
            <p className="font-body text-xs text-muted-foreground">Wishlist Items</p>
          </motion.div>
        </div>

        <div className="space-y-3">
          {menuItems.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <Link to={item.href} className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-body font-semibold text-foreground text-sm">{item.label}</p>
                  <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <StoreFooter />
    </div>
  );
};

export default ProfilePage;
