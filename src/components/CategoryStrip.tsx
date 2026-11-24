import { motion } from "framer-motion";
import { Shirt, Watch, Footprints, Glasses, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";

const fallbackCategories = [
  { id: "men", name: "Men", slug: "men", image_url: null, is_active: true },
  { id: "women", name: "Women", slug: "women", image_url: null, is_active: true },
  { id: "accessories", name: "Accessories", slug: "accessories", image_url: null, is_active: true },
];
const tileColors = ["bg-primary", "bg-secondary", "bg-accent", "bg-brand-orange", "bg-brand-teal", "bg-brand-purple"];

const CategoryStrip = () => {
  const { data, isError } = useCategories();
  const categories = data?.length ? data : isError ? fallbackCategories : [];

  return (
    <section className="py-10 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-8 tracking-wide">
          SHOP BY CATEGORY
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.slug.includes("shoe") || cat.slug.includes("slipper")
              ? Footprints
              : cat.slug.includes("watch")
                ? Watch
                : cat.slug.includes("glass")
                  ? Glasses
                  : cat.slug.includes("shirt") || cat.slug.includes("hoodie")
                    ? Shirt
                    : Tag;
            return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/category/${cat.slug}`} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className={`${tileColors[i % tileColors.length]} w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-card overflow-hidden`}>
                  {cat.image_url
                    ? <img src={cat.image_url} alt="" className="h-full w-full object-cover" />
                    : <Icon className="w-7 h-7 md:w-8 md:h-8 text-card" />}
                </div>
                <span className="font-body text-sm font-semibold text-foreground">{cat.name}</span>
              </Link>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryStrip;
