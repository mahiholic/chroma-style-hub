import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDbProducts } from "@/hooks/useDbProducts";
import { allProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const TrendingProducts = () => {
  const navigate = useNavigate();
  const { data: dbProducts } = useDbProducts();

  const products = (dbProducts && dbProducts.length > 0 ? dbProducts : allProducts).slice(0, 8);

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-foreground">TRENDING NOW</h2>
            <p className="font-body text-sm text-muted-foreground mt-0.5">Our most popular picks</p>
          </div>
          <button
            onClick={() => navigate("/category/men")}
            className="font-body text-sm font-bold text-primary hover:underline"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
