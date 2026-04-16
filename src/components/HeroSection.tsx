import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import modelMen from "@/assets/model-men.png";
import modelWomen from "@/assets/model-women.png";

const floatingHearts = [
  { left: "8%", delay: "0s", size: 20, color: "text-secondary" },
  { left: "20%", delay: "1.2s", size: 14, color: "text-brand-orange" },
  { left: "32%", delay: "2.4s", size: 18, color: "text-secondary" },
  { left: "45%", delay: "0.6s", size: 12, color: "text-accent" },
  { left: "58%", delay: "1.8s", size: 22, color: "text-brand-orange" },
  { left: "72%", delay: "3s", size: 16, color: "text-secondary" },
  { left: "85%", delay: "0.3s", size: 18, color: "text-brand-purple" },
  { left: "92%", delay: "2.1s", size: 14, color: "text-secondary" },
];

const HeroSection = () => {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, currentColor 20px, currentColor 21px), repeating-linear-gradient(-45deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)`
      }} />

      <div className="container mx-auto px-4 py-12 md:py-16 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <p className="font-display text-xl md:text-2xl tracking-widest text-foreground/60 mb-1">DRIPKART</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground leading-none">SHOP FOR</h1>
        </motion.div>

        <div className="flex justify-center gap-6 md:gap-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Link to="/category/men" className="group cursor-pointer block">
              <div className="relative w-40 h-56 md:w-56 md:h-80 rounded-2xl overflow-hidden bg-card shadow-card group-hover:shadow-card-hover transition-shadow">
                <img src={modelMen} alt="Men's collection" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-0 inset-x-0 bg-card/95 backdrop-blur-sm py-3 text-center border-t border-border">
                  <span className="font-display text-2xl md:text-3xl tracking-wide text-foreground">MEN</span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Link to="/category/women" className="group cursor-pointer block">
              <div className="relative w-40 h-56 md:w-56 md:h-80 rounded-2xl overflow-hidden bg-card shadow-card group-hover:shadow-card-hover transition-shadow">
                <img src={modelWomen} alt="Women's collection" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-0 inset-x-0 bg-card/95 backdrop-blur-sm py-3 text-center border-t border-border">
                  <span className="font-display text-2xl md:text-3xl tracking-wide text-foreground">WOMEN</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="text-center mt-10">
          <h2 className="font-display text-3xl md:text-5xl text-foreground">ALL E<span className="text-secondary">Y</span>ES</h2>
          <h2 className="font-display text-3xl md:text-5xl text-foreground"><span className="text-accent">O</span>N Y<span className="text-brand-orange">O</span>U</h2>
          <p className="text-muted-foreground mt-2 font-body text-sm md:text-base">Homegrown & Proud <span className="font-semibold text-foreground">Since 2024</span></p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mt-12"
        >
          <p className="font-body text-xs md:text-sm tracking-[0.3em] text-foreground/60 uppercase mb-2">A Special Dedication To</p>
          <h2 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tight bg-gradient-to-r from-secondary via-brand-orange to-accent bg-clip-text text-transparent leading-none">
            OMISHA
          </h2>
          <p className="font-body text-sm md:text-base text-foreground/70 mt-3 italic">💛 You are loved 💛</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
