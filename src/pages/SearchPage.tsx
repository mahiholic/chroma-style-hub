import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";
import ProductCard from "@/components/ProductCard";
import { allProducts } from "@/data/products";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="font-display text-3xl md:text-4xl text-foreground text-center mb-6">SEARCH</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, categories..."
              className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-border bg-card text-foreground font-body text-lg outline-none focus:border-primary transition-colors"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {query.trim() && (
          <p className="font-body text-sm text-muted-foreground mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""} for "<span className="text-foreground font-semibold">{query}</span>"
          </p>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : query.trim() ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-display text-xl text-foreground">No products found</p>
            <p className="font-body text-sm text-muted-foreground mt-2">Try a different search term</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="font-body text-muted-foreground">Start typing to search products</p>
          </motion.div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
};

export default SearchPage;
