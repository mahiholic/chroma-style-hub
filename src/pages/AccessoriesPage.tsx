import { motion } from "framer-motion";
import { Watch } from "lucide-react";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";

const AccessoriesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gradient-cool py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)`
        }} />
        <div className="relative">
          <p className="font-display text-lg tracking-[0.3em] text-card/70">DRIPKART</p>
          <h1 className="font-display text-5xl md:text-7xl text-card tracking-tight mt-2">ACCESSORIES</h1>
          <p className="font-body text-card/80 mt-3 text-sm md:text-base">Coming Soon</p>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center gap-4">
          <Watch className="w-20 h-20 text-muted-foreground/30" />
          <h2 className="font-display text-2xl text-foreground">LAUNCHING SOON</h2>
          <p className="font-body text-muted-foreground text-center max-w-md">
            We're curating an exclusive collection of accessories. Stay tuned for caps, bags, watches, and more!
          </p>
        </motion.div>
      </div>

      <StoreFooter />
    </div>
  );
};

export default AccessoriesPage;
