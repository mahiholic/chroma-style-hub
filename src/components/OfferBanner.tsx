import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OfferBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-cool rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }} />
          <div className="relative z-10">
            <p className="font-body text-sm font-semibold text-accent-foreground/80 tracking-widest uppercase mb-2">
              Limited Time Offer
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-accent-foreground leading-none mb-3">
              BUY 2 GET 1 FREE
            </h2>
            <p className="font-body text-accent-foreground/80 mb-6 max-w-md mx-auto">
              Mix & match across all categories. Use code <span className="font-bold text-accent-foreground">DRIP3</span> at checkout.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-card text-foreground font-display text-lg tracking-wider px-8 py-3 rounded-full hover:shadow-glow transition-shadow"
            >
              SHOP NOW
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferBanner;
