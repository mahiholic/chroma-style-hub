export interface CategorizedProduct {
  id: number | string;
  categoryId?: string;
}

export function filterProductsByCategoryId<T extends CategorizedProduct>(
  products: T[],
  categoryId: string,
): T[] {
  return products.filter((product) => product.categoryId === categoryId);
}