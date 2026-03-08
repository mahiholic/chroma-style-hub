import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/data/products";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";
import { toast } from "sonner";

const WishlistPage = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleMoveToBag = (productId: number | string) => {
    const product = getProductById(Number(productId));
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[0],
      color: product.colors[0].name,
    });
    removeItem(productId);
    toast.success("Moved to bag! 🛍️");
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-3xl md:text-4xl text-foreground">
            MY WISHLIST <span className="text-primary">({items.length})</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4">
            <Heart className="w-20 h-20 text-muted-foreground/30" />
            <p className="font-body text-lg text-muted-foreground">Your wishlist is empty</p>
            <p className="font-body text-sm text-muted-foreground">Start adding items you love!</p>
            <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
              Explore Products
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl overflow-hidden shadow-card group"
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden bg-muted cursor-pointer"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeItem(item.productId); toast("Removed from wishlist"); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-body text-sm font-semibold text-foreground truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body font-bold text-foreground">₹{item.price}</span>
                      <span className="font-body text-sm text-muted-foreground line-through">₹{item.originalPrice}</span>
                    </div>
                    <Button
                      onClick={() => handleMoveToBag(item.productId)}
                      className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-9 text-xs font-display tracking-wide"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> MOVE TO BAG
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
};

export default WishlistPage;
