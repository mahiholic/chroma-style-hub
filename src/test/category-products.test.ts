import { describe, expect, it } from "vitest";
import { filterProductsByCategoryId } from "@/lib/category-products";

describe("filterProductsByCategoryId", () => {
  it("returns only products assigned to the selected category", () => {
    const products = [
      { id: "shirt-1", categoryId: "category-t-shirts" },
      { id: "shoe-1", categoryId: "category-shoes" },
      { id: "shirt-2", categoryId: "category-t-shirts" },
    ];

    const selected = filterProductsByCategoryId(products, "category-t-shirts");

    expect(selected.map((product) => product.id)).toEqual(["shirt-1", "shirt-2"]);
    expect(selected.every((product) => product.categoryId === "category-t-shirts")).toBe(true);
  });
});