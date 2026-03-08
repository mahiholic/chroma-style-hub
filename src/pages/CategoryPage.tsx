import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useDbProducts } from "@/hooks/useDbProducts";
import { getProductsByCategory } from "@/data/products";

const sortOptions = [
  { label: "Popular", value: "popular" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Discount", value: "discount" },
];

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const cat = (category === "women" ? "women" : category === "accessories" ? "accessories" : "men") as "men" | "women" | "accessories";
  const [sortBy, setSortBy] = useState("popular");
  const [showSort, setShowSort] = useState(false);

  const { data: dbProducts, isLoading } = useDbProducts(cat);

  const products = useMemo(() => {
    const rawList = dbProducts && dbProducts.length > 0 ? dbProducts : getProductsByCategory(cat);
    const list = [...rawList];
    switch (sortBy) {
      case "price-asc": return list.sort((a, b) => a.price - b.price);
      case "price-desc": return list.sort((a, b) => b.price - a.price);
      case "rating": return list.sort((a, b) => b.rating - a.rating);
      case "discount": return list.sort((a, b) => {
        const dA = 1 - a.price / a.originalPrice;
        const dB = 1 - b.price / b.originalPrice;
        return dB - dA;
      });
      default: return list;
    }
  }, [cat, sortBy, dbProducts]);

  const titleMap = { men: "MEN'S COLLECTION", women: "WOMEN'S COLLECTION", accessories: "ACCESSORIES" };
  const title = titleMap[cat];
  const gradientMap = { men: "gradient-cool", women: "gradient-warm", accessories: "gradient-cool" };
  const gradientClass = gradientMap[cat];

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${gradientClass} py-16 md:py-24 text-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)`
        }} />
        <div className="relative">
          <p className="font-display text-lg tracking-[0.3em] text-card/70">DRIPKART</p>
          <h1 className="font-display text-5xl md:text-7xl text-card tracking-tight mt-2">{title}</h1>
          <p className="font-body text-card/80 mt-3 text-sm md:text-base">{products.length} Products</p>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="font-body text-sm font-semibold text-foreground">Filters</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1.5 font-body text-sm font-semibold text-foreground bg-card px-4 py-2 rounded-lg border border-border hover:border-primary transition-colors"
            >
              Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
              <ChevronDown className={`w-4 h-4 transition-transform ${showSort ? "rotate-180" : ""}`} />
            </button>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-card-hover z-10 min-w-[180px] overflow-hidden"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2.5 font-body text-sm transition-colors ${
                      sortBy === opt.value ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-display text-2xl">No products found</p>
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
};

export default CategoryPage;
