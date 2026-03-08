import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";
import product9 from "@/assets/product-9.jpg";
import product10 from "@/assets/product-10.jpg";
import product11 from "@/assets/product-11.jpg";
import product12 from "@/assets/product-12.jpg";
import product13 from "@/assets/product-13.jpg";
import product14 from "@/assets/product-14.jpg";
import product15 from "@/assets/product-15.jpg";
import product16 from "@/assets/product-16.jpg";
import product17 from "@/assets/product-17.jpg";
import product18 from "@/assets/product-18.jpg";
import product19 from "@/assets/product-19.jpg";

export interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  tag: string;
  tagColor: string;
  category: "men" | "women" | "accessories";
  sizes: string[];
  description: string;
  colors: { name: string; hex: string }[];
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Mock reviews data
export const productReviews: Record<number, Review[]> = {
  1: [
    { id: 1, userName: "Arjun M.", rating: 5, comment: "Absolutely love the print! Oversized fit is perfect for my style.", date: "2026-02-15", verified: true },
    { id: 2, userName: "Sneha K.", rating: 4, comment: "Great quality fabric, slightly bigger than expected. Still looks amazing.", date: "2026-02-10", verified: true },
    { id: 3, userName: "Rahul D.", rating: 5, comment: "Got so many compliments wearing this. 10/10 would buy again.", date: "2026-01-28", verified: false },
  ],
  2: [
    { id: 4, userName: "Vikram S.", rating: 5, comment: "Best hoodie I've owned. Heavyweight and warm, graphics are fire.", date: "2026-03-01", verified: true },
    { id: 5, userName: "Priya R.", rating: 4, comment: "Bought for my boyfriend, he wears it every day now!", date: "2026-02-20", verified: true },
  ],
  3: [
    { id: 6, userName: "Karthik N.", rating: 4, comment: "Great anime print, fabric is breathable. Love the jogger set!", date: "2026-02-05", verified: true },
    { id: 7, userName: "Amit P.", rating: 5, comment: "Absolutely fire! My friends are jealous lol.", date: "2026-01-15", verified: true },
    { id: 8, userName: "Rohan G.", rating: 3, comment: "Design is great but sizing runs a bit small. Order one size up.", date: "2026-01-10", verified: false },
  ],
  4: [
    { id: 9, userName: "Ananya S.", rating: 5, comment: "The cutest crop top ever! Pastel colors are gorgeous.", date: "2026-02-25", verified: true },
    { id: 10, userName: "Meera J.", rating: 5, comment: "Perfect for summer. So comfortable and cute!", date: "2026-02-18", verified: true },
    { id: 11, userName: "Divya L.", rating: 4, comment: "Love the kawaii vibes. Fabric could be slightly thicker.", date: "2026-02-01", verified: true },
  ],
  5: [
    { id: 12, userName: "Aditya K.", rating: 5, comment: "Premium quality bomber. Worth every penny!", date: "2026-03-02", verified: true },
    { id: 13, userName: "Siddharth M.", rating: 4, comment: "Great jacket, love the patches. Runs true to size.", date: "2026-02-14", verified: true },
  ],
};

// Generate default reviews for products without specific reviews
export const getProductReviews = (productId: number): Review[] => {
  if (productReviews[productId]) return productReviews[productId];
  return [
    { id: 100 + productId, userName: "Verified Buyer", rating: 4, comment: "Great product, exactly as described. Fast delivery too!", date: "2026-02-10", verified: true },
    { id: 200 + productId, userName: "Happy Customer", rating: 5, comment: "Love it! Quality is amazing for the price.", date: "2026-01-20", verified: true },
  ];
};

// Coupon codes
export interface Coupon {
  code: string;
  type: "percentage" | "flat";
  value: number;
  minOrder: number;
  description: string;
}

export const availableCoupons: Coupon[] = [
  { code: "DRIP10", type: "percentage", value: 10, minOrder: 499, description: "10% off on orders above ₹499" },
  { code: "FLAT200", type: "flat", value: 200, minOrder: 999, description: "₹200 off on orders above ₹999" },
  { code: "NEWUSER", type: "percentage", value: 15, minOrder: 0, description: "15% off for new users" },
  { code: "DRIP500", type: "flat", value: 500, minOrder: 2499, description: "₹500 off on orders above ₹2499" },
];

export const allProducts: Product[] = [
  // MEN (1-6, 15-16, 23-25)
  {
    id: 1, name: "Pop Art Oversized Tee", price: 799, originalPrice: 1599, image: product1,
    rating: 4.5, tag: "BESTSELLER", tagColor: "bg-secondary",
    category: "men", sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Stand out with this bold pop-art inspired oversized tee. Premium cotton fabric with a relaxed fit that's perfect for everyday streetwear.",
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "White", hex: "#f5f5f5" }, { name: "Yellow", hex: "#fbbf24" }],
  },
  {
    id: 2, name: "Bold Statement Hoodie", price: 1299, originalPrice: 2499, image: product2,
    rating: 4.7, tag: "NEW", tagColor: "bg-accent",
    category: "men", sizes: ["S", "M", "L", "XL"],
    description: "Make a statement with this heavyweight hoodie. Features a kangaroo pocket, ribbed cuffs, and an eye-catching graphic print.",
    colors: [{ name: "Charcoal", hex: "#374151" }, { name: "Navy", hex: "#1e3a5f" }],
  },
  {
    id: 3, name: "Anime Jogger Set", price: 1499, originalPrice: 2999, image: product3,
    rating: 4.3, tag: "TRENDING", tagColor: "bg-brand-orange",
    category: "men", sizes: ["S", "M", "L", "XL"],
    description: "Channel your inner anime protagonist with this comfy jogger set. Breathable fabric with bold anime-inspired graphics.",
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Grey", hex: "#9ca3af" }],
  },
  {
    id: 5, name: "Street Bomber Jacket", price: 1999, originalPrice: 3999, image: product5,
    rating: 4.6, tag: "PREMIUM", tagColor: "bg-brand-purple",
    category: "men", sizes: ["M", "L", "XL", "XXL"],
    description: "Premium bomber jacket with satin finish. Ribbed collar and cuffs with custom embroidered patches on the chest and back.",
    colors: [{ name: "Olive", hex: "#65a30d" }, { name: "Black", hex: "#1a1a1a" }],
  },
  {
    id: 6, name: "Camo Cargo Shorts", price: 899, originalPrice: 1799, image: product6,
    rating: 4.4, tag: "50% OFF", tagColor: "bg-primary",
    category: "men", sizes: ["S", "M", "L", "XL"],
    description: "Utility-inspired camo cargo shorts with deep side pockets. Durable cotton twill that's built for adventure.",
    colors: [{ name: "Green Camo", hex: "#4d7c0f" }, { name: "Desert", hex: "#d4a373" }],
  },
  {
    id: 15, name: "Graffiti Print Polo", price: 899, originalPrice: 1499, image: product1,
    rating: 4.2, tag: "NEW", tagColor: "bg-accent",
    category: "men", sizes: ["S", "M", "L", "XL"],
    description: "Urban graffiti-printed polo shirt with a modern slim fit. Perfect for casual outings.",
    colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Black", hex: "#1a1a1a" }],
  },
  {
    id: 16, name: "Distressed Denim Jeans", price: 1399, originalPrice: 2799, image: product3,
    rating: 4.5, tag: "TRENDING", tagColor: "bg-brand-orange",
    category: "men", sizes: ["30", "32", "34", "36"],
    description: "Slim-fit distressed denim jeans with a washed finish. The go-to bottom for any streetwear look.",
    colors: [{ name: "Blue Wash", hex: "#60a5fa" }, { name: "Black", hex: "#1a1a1a" }],
  },
  {
    id: 23, name: "Tech Jogger Pants", price: 1099, originalPrice: 2199, image: product18,
    rating: 4.6, tag: "NEW", tagColor: "bg-accent",
    category: "men", sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Sleek tech-fabric jogger pants with zippered pockets. Tapered fit perfect for athleisure looks.",
    colors: [{ name: "Olive", hex: "#65a30d" }, { name: "Black", hex: "#1a1a1a" }],
  },
  {
    id: 24, name: "Vintage Wash Crew Neck", price: 749, originalPrice: 1499, image: product2,
    rating: 4.3, tag: "50% OFF", tagColor: "bg-primary",
    category: "men", sizes: ["S", "M", "L", "XL"],
    description: "Acid-washed crewneck sweatshirt with a relaxed boxy fit. Heavyweight cotton fleece for cold evenings.",
    colors: [{ name: "Stone", hex: "#d6d3d1" }, { name: "Charcoal", hex: "#374151" }],
  },
  {
    id: 25, name: "Mesh Panel Tank Top", price: 499, originalPrice: 999, image: product6,
    rating: 4.1, tag: "HOT", tagColor: "bg-secondary",
    category: "men", sizes: ["S", "M", "L", "XL"],
    description: "Breathable mesh-panel tank top for gym and outdoor workouts. Moisture-wicking fabric keeps you cool.",
    colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Black", hex: "#1a1a1a" }, { name: "Red", hex: "#ef4444" }],
  },

  // WOMEN (4, 7-12, 26-28)
  {
    id: 4, name: "Pastel Kawaii Crop Top", price: 599, originalPrice: 1199, image: product4,
    rating: 4.8, tag: "HOT", tagColor: "bg-secondary",
    category: "women", sizes: ["XS", "S", "M", "L"],
    description: "Adorable kawaii-inspired crop top in soft pastel shades. Lightweight and breezy — ideal for festivals and sunny outings.",
    colors: [{ name: "Lavender", hex: "#c4b5fd" }, { name: "Pink", hex: "#f9a8d4" }, { name: "Mint", hex: "#6ee7b7" }],
  },
  {
    id: 7, name: "Floral Maxi Dress", price: 1199, originalPrice: 2399, image: product4,
    rating: 4.9, tag: "NEW", tagColor: "bg-accent",
    category: "women", sizes: ["XS", "S", "M", "L", "XL"],
    description: "Elegant floral maxi dress with a flowy silhouette. Perfect for brunches, date nights, or beach vacations.",
    colors: [{ name: "Rose", hex: "#fb7185" }, { name: "Blue", hex: "#60a5fa" }],
  },
  {
    id: 8, name: "Oversized Graphic Tee", price: 699, originalPrice: 1399, image: product1,
    rating: 4.2, tag: "TRENDING", tagColor: "bg-brand-orange",
    category: "women", sizes: ["S", "M", "L", "XL"],
    description: "Bold graphic oversized tee that pairs perfectly with bike shorts or high-waisted jeans.",
    colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Black", hex: "#1a1a1a" }],
  },
  {
    id: 9, name: "Retro Track Pants", price: 999, originalPrice: 1999, image: product3,
    rating: 4.5, tag: "BESTSELLER", tagColor: "bg-secondary",
    category: "women", sizes: ["XS", "S", "M", "L"],
    description: "Vintage-inspired track pants with side stripes. Elastic waistband and relaxed fit for all-day comfort.",
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Maroon", hex: "#7f1d1d" }],
  },
  {
    id: 10, name: "Neon Crop Hoodie", price: 899, originalPrice: 1799, image: product2,
    rating: 4.6, tag: "HOT", tagColor: "bg-secondary",
    category: "women", sizes: ["XS", "S", "M", "L"],
    description: "Vibrant neon crop hoodie with a raw hem finish. Stand out on the streets with this head-turning piece.",
    colors: [{ name: "Neon Green", hex: "#84cc16" }, { name: "Hot Pink", hex: "#ec4899" }],
  },
  {
    id: 11, name: "Denim Jacket Classic", price: 1799, originalPrice: 3599, image: product5,
    rating: 4.7, tag: "PREMIUM", tagColor: "bg-brand-purple",
    category: "women", sizes: ["S", "M", "L"],
    description: "Timeless denim jacket in a relaxed fit. Distressed details and brass buttons for an authentic vintage look.",
    colors: [{ name: "Indigo", hex: "#4338ca" }, { name: "Light Wash", hex: "#93c5fd" }],
  },
  {
    id: 12, name: "Tie-Dye Oversized Tee", price: 649, originalPrice: 1299, image: product6,
    rating: 4.3, tag: "50% OFF", tagColor: "bg-primary",
    category: "women", sizes: ["S", "M", "L", "XL"],
    description: "Groovy tie-dye tee with a boxy oversized fit. Each piece has a unique colour pattern — no two are alike!",
    colors: [{ name: "Rainbow", hex: "#f59e0b" }, { name: "Ocean", hex: "#06b6d4" }],
  },
  {
    id: 26, name: "Floral Summer Blouse", price: 849, originalPrice: 1699, image: product19,
    rating: 4.7, tag: "NEW", tagColor: "bg-accent",
    category: "women", sizes: ["XS", "S", "M", "L", "XL"],
    description: "Elegant floral print blouse with balloon sleeves. Lightweight and perfect for summer brunches.",
    colors: [{ name: "Floral Pink", hex: "#fb7185" }, { name: "Floral Blue", hex: "#60a5fa" }],
  },
  {
    id: 27, name: "High Waist Yoga Leggings", price: 799, originalPrice: 1599, image: product3,
    rating: 4.5, tag: "BESTSELLER", tagColor: "bg-secondary",
    category: "women", sizes: ["XS", "S", "M", "L"],
    description: "Buttery-soft high-waist yoga leggings with 4-way stretch. Squat-proof and moisture-wicking.",
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1e3a5f" }, { name: "Wine", hex: "#7f1d1d" }],
  },
  {
    id: 28, name: "Ruffle Hem Mini Skirt", price: 699, originalPrice: 1399, image: product4,
    rating: 4.4, tag: "TRENDING", tagColor: "bg-brand-orange",
    category: "women", sizes: ["XS", "S", "M", "L"],
    description: "Playful ruffle-hem mini skirt in solid colors. Pair with a crop top for a cute weekend outfit.",
    colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Blush", hex: "#fda4af" }],
  },

  // ACCESSORIES (13-14, 17-22, 29-31)
  {
    id: 13, name: "Classic Leather Watch", price: 1499, originalPrice: 2999, image: product15,
    rating: 4.8, tag: "PREMIUM", tagColor: "bg-brand-purple",
    category: "accessories", sizes: ["One Size"],
    description: "Elegant leather-strap wristwatch with a dark dial. Water-resistant and built for daily wear.",
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Brown", hex: "#92400e" }],
  },
  {
    id: 14, name: "Retro Tortoise Sunglasses", price: 799, originalPrice: 1599, image: product8,
    rating: 4.5, tag: "BESTSELLER", tagColor: "bg-secondary",
    category: "accessories", sizes: ["One Size"],
    description: "Vintage tortoiseshell round sunglasses with UV400 protection. A timeless accessory for any outfit.",
    colors: [{ name: "Tortoise", hex: "#92400e" }, { name: "Black", hex: "#1a1a1a" }],
  },
  {
    id: 17, name: "Canvas Rucksack", price: 1299, originalPrice: 2599, image: product9,
    rating: 4.6, tag: "NEW", tagColor: "bg-accent",
    category: "accessories", sizes: ["One Size"],
    description: "Durable canvas backpack with leather trim. Multiple compartments for everyday carry.",
    colors: [{ name: "Khaki", hex: "#d4a373" }, { name: "Navy", hex: "#1e3a5f" }],
  },
  {
    id: 18, name: "Snapback Baseball Cap", price: 499, originalPrice: 999, image: product16,
    rating: 4.3, tag: "50% OFF", tagColor: "bg-primary",
    category: "accessories", sizes: ["One Size"],
    description: "Clean minimalist snapback cap with adjustable strap. Perfect for bad hair days or streetwear fits.",
    colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Black", hex: "#1a1a1a" }, { name: "Grey", hex: "#9ca3af" }],
  },
  {
    id: 19, name: "Classic Canvas Sneakers", price: 1199, originalPrice: 2399, image: product17,
    rating: 4.7, tag: "TRENDING", tagColor: "bg-brand-orange",
    category: "accessories", sizes: ["6", "7", "8", "9", "10", "11"],
    description: "White canvas low-top sneakers that go with everything. Vulcanized rubber sole for grip and comfort.",
    colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Black", hex: "#1a1a1a" }],
  },
  {
    id: 20, name: "Leather Bifold Wallet", price: 699, originalPrice: 1399, image: product12,
    rating: 4.4, tag: "HOT", tagColor: "bg-secondary",
    category: "accessories", sizes: ["One Size"],
    description: "Hand-stitched genuine leather bifold wallet with multiple card slots and a coin pocket.",
    colors: [{ name: "Brown", hex: "#92400e" }, { name: "Black", hex: "#1a1a1a" }],
  },
  {
    id: 21, name: "Gold Pendant Necklace", price: 599, originalPrice: 1199, image: product13,
    rating: 4.6, tag: "NEW", tagColor: "bg-accent",
    category: "accessories", sizes: ["One Size"],
    description: "Minimalist gold-plated pendant necklace. Tarnish-resistant and hypoallergenic — perfect for layering.",
    colors: [{ name: "Gold", hex: "#f59e0b" }, { name: "Silver", hex: "#d1d5db" }],
  },
  {
    id: 22, name: "Crossbody Sling Bag", price: 899, originalPrice: 1799, image: product14,
    rating: 4.5, tag: "BESTSELLER", tagColor: "bg-secondary",
    category: "accessories", sizes: ["One Size"],
    description: "Compact crossbody sling bag in vegan leather. Zippered compartments and adjustable strap for on-the-go style.",
    colors: [{ name: "Tan", hex: "#d4a373" }, { name: "Black", hex: "#1a1a1a" }],
  },
  {
    id: 29, name: "Bucket Hat Classic", price: 449, originalPrice: 899, image: product16,
    rating: 4.2, tag: "50% OFF", tagColor: "bg-primary",
    category: "accessories", sizes: ["One Size"],
    description: "Classic cotton bucket hat that's reversible. One side solid, other side printed for double the looks.",
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Beige", hex: "#d4a373" }],
  },
  {
    id: 30, name: "Silver Chain Bracelet", price: 399, originalPrice: 799, image: product13,
    rating: 4.3, tag: "HOT", tagColor: "bg-secondary",
    category: "accessories", sizes: ["One Size"],
    description: "Sterling silver-plated chain bracelet with adjustable clasp. Minimalist design for everyday wear.",
    colors: [{ name: "Silver", hex: "#d1d5db" }, { name: "Gold", hex: "#f59e0b" }],
  },
  {
    id: 31, name: "Sports Digital Watch", price: 999, originalPrice: 1999, image: product15,
    rating: 4.5, tag: "TRENDING", tagColor: "bg-brand-orange",
    category: "accessories", sizes: ["One Size"],
    description: "Multi-function digital sports watch with stopwatch, alarm, and LED backlight. Water-resistant up to 50m.",
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Army Green", hex: "#65a30d" }],
  },
];

export const getProductsByCategory = (category: "men" | "women" | "accessories") =>
  allProducts.filter((p) => p.category === category);

export const getProductById = (id: number) => allProducts.find((p) => p.id === id);
