import React, { createContext, useContext, useState, useCallback } from "react";

export interface WishlistItem {
  productId: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.productId === item.productId)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const isWishlisted = useCallback((productId: number) => {
    return items.some((i) => i.productId === productId);
  }, [items]);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.productId === item.productId)) {
        return prev.filter((i) => i.productId !== item.productId);
      }
      return [...prev, item];
    });
  }, []);

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isWishlisted, toggleWishlist, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
