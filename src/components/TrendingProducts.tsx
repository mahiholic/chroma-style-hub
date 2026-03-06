import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { allProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const TrendingProducts = () => {
  const navigate = useNavigate();
  const products = allProducts.slice(0, 6);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-wide">🔥 TRENDING NOW</h2>
          <button onClick={() => navigate("/category/men")} className="font-body text-sm font-semibold text-accent hover:underline">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
