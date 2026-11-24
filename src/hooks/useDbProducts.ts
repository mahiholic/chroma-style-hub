import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

const tagOptions = [
  { tag: "BESTSELLER", tagColor: "bg-secondary" },
  { tag: "NEW", tagColor: "bg-accent" },
  { tag: "TRENDING", tagColor: "bg-brand-orange" },
  { tag: "HOT", tagColor: "bg-secondary" },
  { tag: "PREMIUM", tagColor: "bg-brand-purple" },
];

const defaultSizes: Record<string, string[]> = {
  men: ["S", "M", "L", "XL", "XXL"],
  women: ["XS", "S", "M", "L", "XL"],
  accessories: ["One Size"],
};

const defaultColors = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f5f5f5" },
];

const colorValues: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  red: "#dc2626",
  blue: "#2563eb",
  green: "#16a34a",
  yellow: "#eab308",
  pink: "#ec4899",
  purple: "#9333ea",
  orange: "#ea580c",
  gray: "#6b7280",
  grey: "#6b7280",
  brown: "#854d0e",
  navy: "#1e3a8a",
};

function joinedCategory(row: any) {
  return Array.isArray(row.categories) ? row.categories[0] : row.categories;
}

function mapDbProduct(row: any, index: number): Product {
  const tagInfo = tagOptions[index % tagOptions.length];
  const categoryInfo = joinedCategory(row);
  const category = categoryInfo?.slug || row.category || "general";
  const images = Array.isArray(row.image_urls) && row.image_urls.length > 0
    ? row.image_urls.filter(Boolean)
    : row.image_url
      ? [row.image_url]
      : ["/placeholder.svg"];
  const colorNames = Array.isArray(row.available_colors) && row.available_colors.length > 0
    ? row.available_colors
    : defaultSizes[category]
      ? defaultColors.map((color) => color.name)
      : [];
  const colors = colorNames.map((name: string, colorIndex: number) => {
    const normalized = name.trim().toLowerCase();
    const suppliedHex = /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(name.trim()) ? name.trim() : undefined;
    return {
      name,
      hex: suppliedHex || colorValues[normalized] || "#6b7280",
      image: images[colorIndex] || images[0],
    };
  });
  const discount = row.original_price
    ? Math.round((1 - row.price / row.original_price) * 100)
    : 0;

  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: Number(row.original_price ?? row.price),
    image: images[0],
    images,
    rating: 4.0 + Math.round(Math.random() * 10) / 10,
    tag: discount >= 40 ? `${discount}% OFF` : tagInfo.tag,
    tagColor: discount >= 40 ? "bg-primary" : tagInfo.tagColor,
    category,
    categoryId: row.category_id || undefined,
    categoryName: categoryInfo?.name || category,
    sizes: Array.isArray(row.available_sizes) && row.available_sizes.length > 0
      ? row.available_sizes
      : defaultSizes[category] || [],
    description: row.description || `Premium quality ${row.name.toLowerCase()}. Comfortable and stylish.`,
    colors,
  };
}

export function useDbProducts(category?: string, categoryId?: string, enabled = true) {
  return useQuery({
    queryKey: ["db-products", category, categoryId],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("*, categories!inner(id, name, slug, image_url, is_active)")
        .eq("is_active", true)
        .eq("categories.is_active", true)
        .order("created_at", { ascending: false });

      if (categoryId) q = q.eq("category_id", categoryId);
      else if (category) q = q.eq("category", category);

      // Wrap in a real Promise with timeout to avoid hanging
      const result = await Promise.race([
        q.then(res => res),
        new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("Query timeout") }), 8000)
        ),
      ]);

      if (result.error) throw result.error;
      return (result.data || [])
        .filter((row: any) => joinedCategory(row)?.is_active !== false)
        .map((row: any, i: number) => mapDbProduct(row, i));
    },
    staleTime: 60_000,
    retry: 1,
    retryDelay: 1000,
    enabled,
  });
}

export function useDbProduct(id: string) {
  return useQuery({
    queryKey: ["db-product", id],
    queryFn: async () => {
      const result = await Promise.race([
        supabase
          .from("products")
          .select("*, categories!inner(id, name, slug, image_url, is_active)")
          .eq("id", id)
          .maybeSingle()
          .then(res => res),
        new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("Query timeout") }), 8000)
        ),
      ]);

      if (result.error) throw result.error;
      if (!result.data || joinedCategory(result.data)?.is_active === false) return null;
      return mapDbProduct(result.data, 0);
    },
    staleTime: 60_000,
    retry: 1,
  });
}
