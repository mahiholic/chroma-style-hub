import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-card rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-border hover:shadow-card transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Rating badge */}
        <div className="absolute bottom-2 left-2 bg-card/95 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-primary text-primary" />
          <span className="font-body text-xs font-bold text-foreground">{product.rating}</span>
        </div>
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted
              ? "bg-secondary text-secondary-foreground"
              : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-secondary"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">DRIPKART</p>
        <h3 className="font-body text-sm font-medium text-foreground truncate leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-body font-bold text-sm text-foreground">₹{product.price}</span>
          <span className="font-body text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
          {discount > 0 && (
            <span className="font-body text-xs font-bold text-green-600">{discount}% OFF</span>
          )}
        </div>
        {product.tag && (
          <div className="mt-1.5">
            <span className="inline-block px-2 py-0.5 rounded font-body text-[10px] font-bold bg-muted text-muted-foreground">
              {product.tag}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
