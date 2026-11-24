import { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";
import ProductCard from "@/components/ProductCard";
import { useDbProducts } from "@/hooks/useDbProducts";
import { useCategories } from "@/hooks/useCategories";
import { getProductsByCategory } from "@/data/products";
import { filterProductsByCategoryId } from "@/lib/category-products";

const sortOptions = [
  { label: "Popular", value: "popular" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Discount", value: "discount" },
];

// Map URL type param to product name keywords for filtering
const typeKeywords: Record<string, string[]> = {
  tshirt: ["tee", "t-shirt", "tshirt", "crew neck", "tank", "polo"],
  hoodie: ["hoodie", "hoodie", "sweatshirt", "crew neck"],
  jogger: ["jogger", "track pants", "pants", "cargo pants"],
  jacket: ["jacket", "bomber", "varsity", "denim jacket"],
  shorts: ["shorts", "cargo shorts"],
  top: ["top", "crop", "blouse", "tee"],
  dress: ["dress", "maxi", "midi"],
  skirt: ["skirt", "mini skirt"],
  pants: ["pants", "trousers", "leggings", "palazzo", "jogger", "track"],
};

const typeLabels: Record<string, string> = {
  tshirt: "T-Shirts",
  hoodie: "Hoodies",
  jogger: "Joggers",
  jacket: "Jackets",
  shorts: "Shorts",
  top: "Tops",
  dress: "Dresses",
  skirt: "Skirts",
  pants: "Pants",
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get("type") || "";
  const categorySlug = category || "";
  const isLegacyCategory = ["men", "women", "accessories"].includes(categorySlug);
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  const activeCategory = categories.find((item) => item.slug === categorySlug);
  const { data: dbProducts, isError: productsError } = useDbProducts(undefined, activeCategory?.id, Boolean(activeCategory));
  const [sortBy, setSortBy] = useState("popular");
  const [showSort, setShowSort] = useState(false);

  const products = useMemo(() => {
    const rawList = activeCategory
      ? filterProductsByCategoryId(dbProducts || [], activeCategory.id)
      : isLegacyCategory && (categoriesError || productsError)
        ? getProductsByCategory(categorySlug as "men" | "women" | "accessories")
        : [];
    let list = [...rawList];

    // Apply subcategory type filter
    if (typeFilter && typeKeywords[typeFilter]) {
      const keywords = typeKeywords[typeFilter];
      list = list.filter((p) => {
        const name = p.name.toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return keywords.some((kw) => name.includes(kw) || desc.includes(kw));
      });
    }

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
  }, [activeCategory, isLegacyCategory, categoriesError, productsError, categorySlug, sortBy, dbProducts, typeFilter]);

  const baseTitle = categorySlug === "men"
    ? "MEN'S"
    : categorySlug === "women"
      ? "WOMEN'S"
      : activeCategory?.name.toUpperCase() || "";
  const title = typeFilter && typeLabels[typeFilter]
    ? `${baseTitle} ${typeLabels[typeFilter].toUpperCase()}`
    : categorySlug === "men" || categorySlug === "women"
      ? `${baseTitle} COLLECTION`
      : baseTitle;
  const gradientClass = categorySlug === "women" ? "gradient-warm" : "gradient-cool";
  const clearTypeFilter = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("type");
    setSearchParams(nextParams);
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNavbar />
        <div className="flex min-h-80 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
        <StoreFooter />
      </div>
    );
  }

  if (!activeCategory && !(categoriesError && isLegacyCategory)) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNavbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-foreground">CATEGORY NOT FOUND</h1>
          <Link to="/" className="mt-4 inline-block font-body text-sm text-primary hover:underline">Back to home</Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${gradientClass} py-16 md:py-24 text-center relative overflow-hidden`}
      >
        {activeCategory?.image_url && (
          <>
            <img src={activeCategory.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-foreground/55" />
          </>
        )}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)`
        }} />
        <div className="relative">
          <p className="font-display text-lg tracking-[0.3em] text-card/70">DRIPKART</p>
          <h1 className="font-display text-5xl md:text-7xl text-card tracking-tight mt-2">{title}</h1>
          <p className="font-body text-card/80 mt-3 text-sm md:text-base">{products.length} Products</p>
        </div>
      </motion.section>

      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 font-body text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>›</span>
            <Link to={`/category/${categorySlug}`} className="hover:text-primary capitalize">{activeCategory?.name || categorySlug}</Link>
            {typeFilter && typeLabels[typeFilter] && (
              <>
                <span>›</span>
                <span className="text-foreground font-semibold">{typeLabels[typeFilter]}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="font-body text-sm font-semibold text-foreground">Filters</span>
            {typeFilter && typeLabels[typeFilter] && (
              <button
                onClick={clearTypeFilter}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-body text-xs font-semibold"
              >
                {typeLabels[typeFilter]}
                <X className="w-3 h-3" />
              </button>
            )}
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-display text-2xl">No products in {activeCategory?.name || categorySlug} yet</p>
            {typeFilter && (
              <button onClick={clearTypeFilter} className="mt-4 font-body text-sm text-primary hover:underline">
                Clear filter and show all
              </button>
            )}
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
};

export default CategoryPage;
