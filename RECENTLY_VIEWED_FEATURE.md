# Recently Viewed Products Feature

## Overview

This document describes the Recently Viewed Products feature that tracks products users open and displays them in a horizontal carousel on the home screen. The feature uses local storage (AsyncStorage) for offline functionality with automatic duplicate prevention.

## Architecture

### 1. Storage Layer (`utils/storage.ts`)

The storage utility provides three main functions for managing recently viewed products:

#### `saveRecentlyViewed(product: Omit<RecentlyViewedProduct, "viewedAt">)`
- Saves a product to the recently viewed list
- Automatically adds a `viewedAt` timestamp
- Prevents duplicates by removing existing entries with the same product ID
- Maintains a maximum of 20 most recent products
- All products are sorted by most recent first

#### `getRecentlyViewed(): Promise<RecentlyViewedProduct[]>`
- Retrieves all recently viewed products
- Returns products sorted by most recent first
- Returns empty array if no products are stored

#### `clearRecentlyViewed(): Promise<void>`
- Clears all recently viewed products from storage
- Useful for logout or user-initiated clearing

**Data Structure:**
```typescript
interface RecentlyViewedProduct {
  _id: string;
  name: string;
  brand: string;
  price: number;
  discount?: string;
  description?: string;
  sizes?: string[];
  images: string[];
  viewedAt: number; // Unix timestamp
}
```

### 2. Global State Management (`context/RecentlyViewedContext.tsx`)

A React Context that manages recently viewed products at the app level.

#### `useRecentlyViewed()` Hook

Provides access to:
- `products`: Array of recently viewed products (sorted by most recent)
- `addToRecentlyViewed(product)`: Adds/updates a product and updates state
- `clearAll()`: Clears all recently viewed products
- `isLoading`: Boolean indicating if data is still loading from storage

**Usage:**
```typescript
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

function MyComponent() {
  const { products, addToRecentlyViewed, clearAll, isLoading } = useRecentlyViewed();
  
  // Add a product to recently viewed
  await addToRecentlyViewed({
    _id: "123",
    name: "Product Name",
    brand: "Brand",
    price: 999,
    images: ["url1", "url2"],
    // ...other fields
  });
}
```

### 3. Carousel Component (`components/RecentlyViewedCarousel.tsx`)

A horizontal scrollable carousel displaying recently viewed products.

**Features:**
- Shows up to 20 recently viewed products
- Displays product image, brand, name, price, and discount
- Horizontal FlatList with smooth scrolling
- Shows partial view of next item for better UX
- Hides automatically when no products are available
- Responsive design using dynamic dimensions
- Navigate to product detail screen on product press

**Styling:**
- Card width: Approximately 40% of screen width for 2.5 items visible
- Grid-like layout with consistent spacing
- Clean, minimal design matching Myntra's aesthetic

### 4. Home Screen Integration (`app/index.tsx`)

The RecentlyViewedCarousel is integrated into the home screen between the hero banner and featured collection section.

**Layout:**
1. Hero Banner
2. Recently Viewed Carousel (conditionally rendered if products exist)
3. Featured Collection Section

### 5. Product Detail Screen (`app/product/[id].tsx`)

A detailed product view that:
- Displays full product information
- Shows multiple images with thumbnail selector
- Allows size selection
- Includes Add to Cart and Wishlist buttons
- **Automatically tracks the product as recently viewed** when the screen loads

**Key Feature:**
The product detail screen calls `addToRecentlyViewed()` when the product is fetched, ensuring every product view is tracked.

## Implementation Details

### Flow Diagram

```
User Opens App
    ↓
App Layout initialized → RecentlyViewedProvider wraps app
    ↓
RecentlyViewedContext loads data from AsyncStorage
    ↓
Home Screen renders
    ↓
RecentlyViewedCarousel displays loaded products
    ↓
User clicks product
    ↓
Product Detail Screen opens
    ↓
Product fetched from API and automatically added to recently viewed
    ↓
User returns to home
    ↓
Carousel updates with new recently viewed product
```

### Data Persistence

- **Storage Type:** AsyncStorage (non-encrypted, suitable for non-sensitive data)
- **Storage Key:** `recently_viewed_products`
- **Data Format:** JSON stringified array of products
- **Persistence:** Survives app restarts and offline scenarios
- **Max Items:** 20 products (automatically trimmed when exceeded)

### Duplicate Prevention

When a product is added:
1. Check if product with same `_id` already exists
2. If exists, remove the old entry
3. Add the new entry with current timestamp at the beginning
4. This ensures most recently viewed items appear first

### Performance Considerations

- Asynchronous loading prevents UI blocking
- Lazy loading of product images in carousel
- FlatList with `showsHorizontalScrollIndicator={false}` for smooth UX
- `scrollEventThrottle` set to 16ms for responsive scrolling
- ProductCard components are memoizable for re-render optimization

## Integration Checklist

- [x] AsyncStorage dependency added to package.json
- [x] Storage utility functions created
- [x] RecentlyViewedContext created and provides hook
- [x] App layout wrapped with RecentlyViewedProvider
- [x] RecentlyViewedCarousel component created
- [x] Home screen integrated with carousel
- [x] Product detail screen created with automatic tracking
- [x] Navigation between screens functional

## Testing Scenarios

### Test Case 1: Basic Tracking
1. Open app
2. Navigate to product detail screen
3. Return to home
4. Verify product appears in Recently Viewed carousel

### Test Case 2: Duplicate Prevention
1. View Product A
2. View Product B
3. View Product A again
4. Verify Product A appears first in carousel with only one entry

### Test Case 3: Offline Functionality
1. View 5 products
2. Turn off internet
3. Close and reopen app
4. Verify recently viewed products still display

### Test Case 4: Max Items Limit
1. View 25+ different products
2. Verify only last 20 are stored
3. Verify oldest item is removed from carousel

### Test Case 5: Carousel UI
1. Verify carousel only shows when products exist
2. Verify carousel properly scrolls horizontally
3. Verify product images load correctly
4. Verify clicking product navigates to detail screen

## Customization Options

### Change Maximum Stored Items
In `utils/storage.ts`, modify:
```typescript
const MAX_RECENTLY_VIEWED = 20; // Change to desired number
```

### Change Storage Key
In `utils/storage.ts`, modify:
```typescript
const RECENTLY_VIEWED_KEY = "recently_viewed_products"; // Change key name
```

### Modify Carousel Card Width
In `components/RecentlyViewedCarousel.tsx`, modify:
```typescript
const PRODUCT_CARD_WIDTH = (width - 32) / 2.5; // Adjust divisor for different widths
```

### Change Carousel Colors/Styling
Update the style objects in `RecentlyViewedCarousel.tsx` and `ProductCard` component to match your brand colors.

## Future Enhancements

1. **Cloud Sync:** Sync recently viewed products with user account
2. **Analytics:** Track which products are viewed most frequently
3. **Recommendations:** Suggest similar products based on viewing history
4. **Expiration:** Auto-remove products viewed more than X days ago
5. **Personalization:** Show different carousels based on user preferences
6. **Wishlist Integration:** Mark recently viewed items that are also in wishlist

## Troubleshooting

### Recently Viewed Carousel Not Showing
- Verify app is wrapped with `RecentlyViewedProvider` in `app/_layout.tsx`
- Check console for errors in context loading
- Ensure at least one product has been viewed

### Products Not Persisting After Close
- Verify AsyncStorage is properly installed
- Check device storage permissions
- Verify `saveRecentlyViewed()` is being called in product detail screen

### Navigation Not Working
- Verify `app/product/[id].tsx` file exists
- Check Expo Router configuration
- Verify router.push() is using correct path format

## Related Files

- `utils/storage.ts` - Storage functions
- `context/RecentlyViewedContext.tsx` - State management
- `components/RecentlyViewedCarousel.tsx` - UI component
- `app/index.tsx` - Home screen integration
- `app/product/[id].tsx` - Product detail with tracking
- `package.json` - AsyncStorage dependency

## Dependencies

- `@react-native-async-storage/async-storage` ^1.23.1
- `expo-router` (for navigation)
- `react-native` (core functionality)
- `axios` (for API calls in product detail)
