import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
}

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: ["categories", includeInactive],
    queryFn: async (): Promise<StoreCategory[]> => {
      const query = supabase
        .from("categories")
        .select("id, name, slug, image_url, is_active")
        .order("name", { ascending: true });
      const categoryQuery = includeInactive ? query : query.eq("is_active", true);
      const result = await Promise.race([
        categoryQuery,
        new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("Category query timeout") }), 8000),
        ),
      ]);

      if (result.error) throw result.error;
      return result.data || [];
    },
    staleTime: 60_000,
    retry: 1,
  });
}