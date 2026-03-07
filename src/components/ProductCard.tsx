import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className={`absolute top-3 left-3 ${product.tagColor} text-card text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full tracking-wider`}>
          {product.tag}
        </span>
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            wishlisted
              ? "bg-secondary text-secondary-foreground"
              : "bg-card/80 backdrop-blur-sm hover:bg-secondary hover:text-secondary-foreground"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            className="w-full bg-foreground text-card py-3 font-body text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="w-4 h-4" />
            VIEW PRODUCT
          </button>
        </div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-body text-sm font-semibold text-foreground truncate">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="text-xs text-muted-foreground font-medium">{product.rating}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-body font-bold text-foreground">₹{product.price}</span>
          <span className="font-body text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
          <span className="text-xs font-bold text-success">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
