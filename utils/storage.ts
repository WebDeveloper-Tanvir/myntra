import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";

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

const RECENTLY_VIEWED_FILE = `${FileSystem.documentDirectory}recently_viewed.json`;
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

    await FileSystem.writeAsStringAsync(
      RECENTLY_VIEWED_FILE,
      JSON.stringify(trimmed),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  } catch (error) {
    console.error("Error saving recently viewed product:", error);
  }
};

export const getRecentlyViewed = async (): Promise<RecentlyViewedProduct[]> => {
  try {
    const fileExists = await FileSystem.getInfoAsync(RECENTLY_VIEWED_FILE);
    if (fileExists.exists) {
      const data = await FileSystem.readAsStringAsync(RECENTLY_VIEWED_FILE, {
        encoding: FileSystem.EncodingType.UTF8,
      });
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
    const fileExists = await FileSystem.getInfoAsync(RECENTLY_VIEWED_FILE);
    if (fileExists.exists) {
      await FileSystem.deleteAsync(RECENTLY_VIEWED_FILE);
    }
  } catch (error) {
    console.error("Error clearing recently viewed products:", error);
  }
};
