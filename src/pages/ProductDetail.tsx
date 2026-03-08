import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag, Truck, RotateCcw, Shield, ChevronLeft, MapPin, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allProducts, type Product } from "@/data/products";
import { useDbProduct, useDbProducts } from "@/hooks/useDbProducts";
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

  const staticProduct = allProducts.find((p) => String(p.id) === id);
  const { data: dbProduct, isLoading: dbLoading } = useDbProduct(id || "");
  const product: Product | null | undefined = staticProduct || dbProduct;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  const { data: dbRelated = [] } = useDbProducts(product?.category);
  const staticRelated = allProducts.filter((p) => p.category === product?.category && String(p.id) !== id).slice(0, 4);
  const related = dbRelated.length > 0
    ? dbRelated.filter((p) => String(p.id) !== id).slice(0, 4)
    : staticRelated;

  if (!staticProduct && dbLoading) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNavbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNavbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="font-display text-4xl text-foreground mb-4">Product Not Found</h1>
            <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground font-display">Go Home</Button>
          </div>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

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

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      setPincodeResult("Delivery available! Expected by " + new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }));
    } else {
      setPincodeResult("Please enter a valid 6-digit pincode");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 font-body text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>›</span>
            <Link to={`/category/${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
            <span>›</span>
            <span className="text-foreground font-semibold truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {/* Left: Product Image */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="relative rounded-lg overflow-hidden bg-muted aspect-[3/4]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <button
                onClick={handleWishlist}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                  wishlisted ? "bg-secondary text-secondary-foreground" : "bg-card text-muted-foreground hover:text-secondary"
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>
            {/* Thumbnail strip (mock multiple views) */}
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`w-16 h-20 rounded border-2 overflow-hidden cursor-pointer ${i === 0 ? "border-primary" : "border-border hover:border-foreground"}`}>
                  <img src={product.image} alt="" className="w-full h-full object-cover opacity-90" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            {/* Brand */}
            <p className="font-body text-sm font-bold text-muted-foreground uppercase tracking-wider">DRIPKART</p>
            <h1 className="font-body text-xl md:text-2xl font-medium text-foreground mt-1 leading-snug">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-success/10 px-2 py-0.5 rounded">
                <Star className="w-3.5 h-3.5 fill-success text-success" />
                <span className="text-xs font-bold text-success">{product.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">2.1k Ratings</span>
            </div>

            {/* Price */}
            <div className="mt-4 pb-4 border-b border-border">
              <div className="flex items-baseline gap-2">
                <span className="font-body text-2xl font-bold text-foreground">₹{product.price}</span>
                <span className="font-body text-base text-muted-foreground line-through">₹{product.originalPrice}</span>
                <span className="font-body text-sm font-bold text-green-600">{discount}% OFF</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">inclusive of all taxes</p>
            </div>

            {/* Offers */}
            <div className="mt-4 space-y-2">
              <p className="font-body text-sm font-bold text-foreground flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-primary" /> Offers
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {["Buy 2 for ₹1199", "Buy 3 for ₹1499", "Use code DRIP10"].map((offer) => (
                  <span key={offer} className="shrink-0 px-3 py-1.5 rounded border border-dashed border-primary/50 font-body text-xs text-foreground bg-primary/5">
                    {offer}
                  </span>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mt-5">
              <p className="font-body text-sm font-bold text-foreground mb-2">
                Color: <span className="font-normal text-muted-foreground">{selectedColor || "Select"}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? "border-foreground scale-110" : "border-border"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-sm font-bold text-foreground">Select Size</p>
                <button className="font-body text-xs font-bold text-primary hover:underline">SIZE GUIDE</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[44px] h-10 px-3 rounded-md font-body text-sm font-semibold border transition-all ${
                      selectedSize === s
                        ? "border-foreground bg-foreground text-card"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-primary text-primary-foreground font-body text-sm font-bold tracking-wide hover:bg-primary/90 gap-2 rounded-md"
              >
                <ShoppingBag className="w-4 h-4" /> ADD TO BAG
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlist}
                className={`h-12 px-6 font-body text-sm font-bold gap-2 rounded-md ${
                  wishlisted
                    ? "border-secondary text-secondary bg-secondary/5"
                    : "border-border text-foreground hover:border-foreground"
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-secondary text-secondary" : ""}`} />
                WISHLIST
              </Button>
            </div>

            {/* Delivery Check */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="font-body text-sm font-bold text-foreground flex items-center gap-1.5 mb-2">
                <MapPin className="w-4 h-4" /> Check Delivery
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setPincodeResult(null); }}
                  className="w-36 font-body text-sm h-9"
                  maxLength={6}
                />
                <Button variant="outline" onClick={handlePincodeCheck} className="h-9 font-body text-sm font-bold">
                  CHECK
                </Button>
              </div>
              {pincodeResult && (
                <p className={`font-body text-xs mt-1.5 ${pincodeResult.includes("available") ? "text-green-600" : "text-destructive"}`}>
                  {pincodeResult.includes("available") && <Check className="w-3 h-3 inline mr-1" />}
                  {pincodeResult}
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-border">
              {[
                { icon: Truck, label: "Free Delivery", desc: "Above ₹399" },
                { icon: RotateCcw, label: "15 Day Returns", desc: "Easy returns" },
                { icon: Shield, label: "100% Secure", desc: "Payment" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs font-bold text-foreground">{label}</span>
                  <span className="text-[10px] text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="font-body text-sm font-bold text-foreground mb-2">Product Description</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ProductReviews productId={product.id} productRating={product.rating} />

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-foreground mb-6">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
