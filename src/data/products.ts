import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface Product {
  id: number;
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

export const allProducts: Product[] = [
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
    id: 4, name: "Pastel Kawaii Crop Top", price: 599, originalPrice: 1199, image: product4,
    rating: 4.8, tag: "HOT", tagColor: "bg-secondary",
    category: "women", sizes: ["XS", "S", "M", "L"],
    description: "Adorable kawaii-inspired crop top in soft pastel shades. Lightweight and breezy — ideal for festivals and sunny outings.",
    colors: [{ name: "Lavender", hex: "#c4b5fd" }, { name: "Pink", hex: "#f9a8d4" }, { name: "Mint", hex: "#6ee7b7" }],
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
];

export const getProductsByCategory = (category: "men" | "women" | "accessories") =>
  allProducts.filter((p) => p.category === category);

export const getProductById = (id: number) => allProducts.find((p) => p.id === id);
