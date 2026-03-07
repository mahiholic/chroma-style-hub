import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";
import ProductCard from "@/components/ProductCard";
import { allProducts } from "@/data/products";

const NewDropsPage = () => {
  const newProducts = allProducts.filter((p) => p.tag === "NEW" || p.tag === "TRENDING" || p.tag === "HOT");

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gradient-hero py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)`
        }} />
        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <p className="font-display text-lg tracking-[0.3em] text-foreground/70">FRESH OFF THE PRESS</p>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-foreground tracking-tight">NEW DROPS</h1>
          <p className="font-body text-foreground/80 mt-3 text-sm md:text-base">{newProducts.length} Hot New Products</p>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      <StoreFooter />
    </div>
  );
};

export default NewDropsPage;
