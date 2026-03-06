const TopBanner = () => {
  return (
    <div className="gradient-warm overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap py-2">
        {[...Array(2)].map((_, i) => (
          <span key={i} className="mx-8 text-sm font-semibold text-secondary-foreground tracking-wider">
            🔥 FLAT 50% OFF ON EVERYTHING &nbsp;&nbsp; ⚡ FREE SHIPPING ABOVE ₹799 &nbsp;&nbsp; 🎉 NEW ARRIVALS EVERY WEEK &nbsp;&nbsp; 💛 2 CRORE+ HAPPY CUSTOMERS &nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopBanner;
