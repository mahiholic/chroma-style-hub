import { motion } from "framer-motion";
import { Shirt, Watch, Footprints, Glasses } from "lucide-react";

const categories = [
  { name: "T-Shirts", icon: Shirt, color: "bg-primary" },
  { name: "Hoodies", icon: Shirt, color: "bg-secondary" },
  { name: "Joggers", icon: Footprints, color: "bg-accent" },
  { name: "Accessories", icon: Watch, color: "bg-brand-orange" },
  { name: "Eyewear", icon: Glasses, color: "bg-brand-teal" },
  { name: "Jackets", icon: Shirt, color: "bg-brand-purple" },
];

const CategoryStrip = () => {
  return (
    <section className="py-10 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-8 tracking-wide">
          SHOP BY CATEGORY
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className={`${cat.color} w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-card`}>
                <cat.icon className="w-7 h-7 md:w-8 md:h-8 text-card" />
              </div>
              <span className="font-body text-sm font-semibold text-foreground tracking-wide">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryStrip;
