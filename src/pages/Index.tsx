import StoreNavbar from "@/components/StoreNavbar";
import HeroSection from "@/components/HeroSection";
import CategoryStrip from "@/components/CategoryStrip";
import TrendingProducts from "@/components/TrendingProducts";
import OfferBanner from "@/components/OfferBanner";
import TrustStrip from "@/components/TrustStrip";
import StoreFooter from "@/components/StoreFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <HeroSection />
      <CategoryStrip />
      <TrendingProducts />
      <OfferBanner />
      <TrustStrip />
      <StoreFooter />
    </div>
  );
};

export default Index;
