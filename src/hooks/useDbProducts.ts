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

function mapDbProduct(row: any, index: number): Product {
  const tagInfo = tagOptions[index % tagOptions.length];
  const discount = row.original_price
    ? Math.round((1 - row.price / row.original_price) * 100)
    : 0;

  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: Number(row.original_price || row.price * 2),
    image: row.image_url || "/placeholder.svg",
    rating: 4.0 + Math.round(Math.random() * 10) / 10,
    tag: discount >= 40 ? `${discount}% OFF` : tagInfo.tag,
    tagColor: discount >= 40 ? "bg-primary" : tagInfo.tagColor,
    category: (row.category === "women" ? "women" : row.category === "accessories" ? "accessories" : "men") as Product["category"],
    sizes: defaultSizes[row.category] || defaultSizes.men,
    description: row.description || `Premium quality ${row.name.toLowerCase()}. Comfortable and stylish.`,
    colors: defaultColors,
  };
}

export function useDbProducts(category?: string) {
  return useQuery({
    queryKey: ["db-products", category],
    queryFn: async () => {
      console.log("[useDbProducts] Fetching products, category:", category);
      let q = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (category) q = q.eq("category", category);

      const { data, error } = await q;
      console.log("[useDbProducts] Result:", { data: data?.length, error });
      if (error) throw error;
      return (data || []).map((row, i) => mapDbProduct(row, i));
    },
    staleTime: 60_000,
    retry: 1,
  });
}

export function useDbProduct(id: string) {
  return useQuery({
    queryKey: ["db-product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return mapDbProduct(data, 0);
    },
    staleTime: 60_000,
  });
}
