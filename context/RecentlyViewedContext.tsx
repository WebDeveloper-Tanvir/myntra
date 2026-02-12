import React, { createContext, useContext, useEffect, useState } from "react";
import {
  saveRecentlyViewed,
  getRecentlyViewed,
  clearRecentlyViewed,
  RecentlyViewedProduct,
} from "@/utils/storage";

interface RecentlyViewedContextType {
  products: RecentlyViewedProduct[];
  addToRecentlyViewed: (product: Omit<RecentlyViewedProduct, "viewedAt">) => Promise<void>;
  clearAll: () => Promise<void>;
  isLoading: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(
  undefined
);

export const RecentlyViewedProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recently viewed products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getRecentlyViewed();
        setProducts(data);
      } catch (error) {
        console.error("Error loading recently viewed products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const addToRecentlyViewed = async (
    product: Omit<RecentlyViewedProduct, "viewedAt">
  ) => {
    try {
      await saveRecentlyViewed(product);
      const updated = await getRecentlyViewed();
      setProducts(updated);
    } catch (error) {
      console.error("Error adding to recently viewed:", error);
    }
  };

  const clearAll = async () => {
    try {
      await clearRecentlyViewed();
      setProducts([]);
    } catch (error) {
      console.error("Error clearing recently viewed:", error);
    }
  };

  return (
    <RecentlyViewedContext.Provider
      value={{ products, addToRecentlyViewed, clearAll, isLoading }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error(
      "useRecentlyViewed must be used within a RecentlyViewedProvider"
    );
  }
  return context;
};
