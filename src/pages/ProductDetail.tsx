import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag, Truck, RotateCcw, Shield, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById, allProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const product = getProductById(Number(id));

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground">Go Home</Button>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    if (!selectedColor) { toast.error("Please select a color"); return; }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
    });
    toast.success("Added to bag! 🎉");
  };

  const handleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
    });
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <div className="container mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 font-body text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative rounded-2xl overflow-hidden bg-muted aspect-[3/4]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <span className={`absolute top-4 left-4 ${product.tagColor} text-card text-xs font-bold px-3 py-1.5 rounded-full tracking-wider`}>
              {product.tag}
            </span>
            <button
              onClick={handleWishlist}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                wishlisted ? "bg-secondary text-secondary-foreground" : "bg-card/80 backdrop-blur-sm hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">{product.category}'s Collection</span>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mt-2">{product.name}</h1>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 bg-success/10 px-2.5 py-1 rounded-full">
                <Star className="w-4 h-4 fill-success text-success" />
                <span className="text-sm font-semibold text-success">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">• 2.1k ratings</span>
            </div>

            <div className="flex items-baseline gap-3 mt-5">
              <span className="font-display text-4xl text-foreground">₹{product.price}</span>
              <span className="font-body text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
              <span className="text-sm font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">{discount}% OFF</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>

            <div className="mt-6">
              <p className="font-body font-semibold text-sm text-foreground mb-3">COLOR: {selectedColor}</p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === c.name ? "border-primary scale-110 shadow-glow" : "border-border"}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="font-body font-semibold text-sm text-foreground mb-3">SELECT SIZE</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-xl font-body font-semibold text-sm border-2 transition-all ${
                      selectedSize === s
                        ? "border-primary bg-primary text-primary-foreground shadow-glow"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-primary text-primary-foreground font-display text-xl tracking-wide hover:bg-primary/90 gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> ADD TO BAG
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlist}
                className={`h-14 px-6 border-2 transition-colors ${
                  wishlisted
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </Button>
            </div>

            <div className="mt-8 p-5 bg-card rounded-xl border border-border">
              <h3 className="font-display text-xl text-foreground mb-2">PRODUCT DETAILS</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: RotateCcw, label: "15 Day Returns" },
                { icon: Shield, label: "Secure Payment" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border">
                  <Icon className="w-5 h-5 text-accent" />
                  <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} productRating={product.rating} />

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-3xl text-foreground mb-6">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
};

export default ProductDetail;
