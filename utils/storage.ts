import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// User Data Storage (Secure)
export const saveUserData = async (
  _id: string,
  name: string,
  email: string
) => {
  await SecureStore.setItemAsync("userid", _id);
  await SecureStore.setItemAsync("userName", name);
  await SecureStore.setItemAsync("userEmail", email);
};

export const getUserData = async () => {
  const _id = await SecureStore.getItemAsync("userid");
  const name = await SecureStore.getItemAsync("userName");
  const email = await SecureStore.getItemAsync("userEmail");
  return { _id, name, email };
};

export const clearUserData = async () => {
  await SecureStore.deleteItemAsync("userid");
  await SecureStore.deleteItemAsync("userName");
  await SecureStore.deleteItemAsync("userEmail");
};

// Recently Viewed Products Storage
export interface RecentlyViewedProduct {
  _id: string;
  name: string;
  brand: string;
  price: number;
  discount?: string;
  description?: string;
  sizes?: string[];
  images: string[];
  viewedAt: number;
}

const RECENTLY_VIEWED_KEY = "recently_viewed_products";
const MAX_RECENTLY_VIEWED = 20;

export const saveRecentlyViewed = async (
  product: Omit<RecentlyViewedProduct, "viewedAt">
): Promise<void> => {
  try {
    const existing = await getRecentlyViewed();

    // Remove duplicate if exists (to update timestamp)
    const filtered = existing.filter((p) => p._id !== product._id);

    // Add the new product with current timestamp
    const updated: RecentlyViewedProduct[] = [
      {
        ...product,
        viewedAt: Date.now(),
      },
      ...filtered,
    ];

    // Keep only the last 20 items
    const trimmed = updated.slice(0, MAX_RECENTLY_VIEWED);

    await AsyncStorage.setItem(
      RECENTLY_VIEWED_KEY,
      JSON.stringify(trimmed)
    );
  } catch (error) {
    console.error("Error saving recently viewed product:", error);
  }
};

export const getRecentlyViewed = async (): Promise<RecentlyViewedProduct[]> => {
  try {
    const data = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    if (data) {
      const products = JSON.parse(data) as RecentlyViewedProduct[];
      // Ensure sorted by most recent first
      return products.sort((a, b) => b.viewedAt - a.viewedAt);
    }
    return [];
  } catch (error) {
    console.error("Error getting recently viewed products:", error);
    return [];
  }
};

export const clearRecentlyViewed = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (error) {
    console.error("Error clearing recently viewed products:", error);
  }
};
