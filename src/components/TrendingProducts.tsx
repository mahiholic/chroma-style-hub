import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { id: 1, name: "Pop Art Oversized Tee", price: 799, originalPrice: 1599, image: product1, rating: 4.5, tag: "BESTSELLER", tagColor: "bg-secondary" },
  { id: 2, name: "Bold Statement Hoodie", price: 1299, originalPrice: 2499, image: product2, rating: 4.7, tag: "NEW", tagColor: "bg-accent" },
  { id: 3, name: "Anime Jogger Set", price: 1499, originalPrice: 2999, image: product3, rating: 4.3, tag: "TRENDING", tagColor: "bg-brand-orange" },
  { id: 4, name: "Pastel Kawaii Crop Top", price: 599, originalPrice: 1199, image: product4, rating: 4.8, tag: "HOT", tagColor: "bg-secondary" },
  { id: 5, name: "Street Bomber Jacket", price: 1999, originalPrice: 3999, image: product5, rating: 4.6, tag: "PREMIUM", tagColor: "bg-brand-purple text-card" },
  { id: 6, name: "Camo Cargo Shorts", price: 899, originalPrice: 1799, image: product6, rating: 4.4, tag: "50% OFF", tagColor: "bg-primary" },
];

const TrendingProducts = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-wide">
            🔥 TRENDING NOW
          </h2>
          <a href="#" className="font-body text-sm font-semibold text-accent hover:underline">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Tag */}
                <span className={`absolute top-3 left-3 ${product.tagColor} text-card text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full tracking-wider`}>
                  {product.tag}
                </span>
                {/* Wishlist */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                {/* Quick add */}
                <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform">
                  <button className="w-full bg-foreground text-card py-3 font-body text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    <ShoppingBag className="w-4 h-4" />
                    ADD TO BAG
                  </button>
                </div>
              </div>

              {/* Info */}
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
