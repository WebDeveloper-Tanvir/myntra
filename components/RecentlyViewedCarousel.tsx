import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { RecentlyViewedProduct } from "@/utils/storage";

const { width } = Dimensions.get("window");
const PRODUCT_CARD_WIDTH = (width - 32) / 2.5; // Allows partial view of next item

const ProductCard = ({ product }: { product: RecentlyViewedProduct }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        marginRight: 12,
        width: PRODUCT_CARD_WIDTH,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Product Image */}
      <View
        style={{
          width: "100%",
          aspectRatio: 1,
          backgroundColor: "#e0e0e0",
        }}
      >
        <Image
          source={{ uri: product.images?.[0] || "https://via.placeholder.com/200" }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "cover",
          }}
        />
      </View>

      {/* Product Info */}
      <View style={{ padding: 8 }}>
        {/* Brand */}
        {product.brand && (
          <Text
            style={{
              fontSize: 11,
              color: "#999",
              marginBottom: 2,
            }}
            numberOfLines={1}
          >
            {product.brand}
          </Text>
        )}

        {/* Product Name */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 4,
            color: "#333",
          }}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Price */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#333",
            }}
          >
            ₹{product.price}
          </Text>
          {product.discount && (
            <Text
              style={{
                fontSize: 11,
                color: "#ff6b6b",
                fontWeight: "600",
              }}
            >
              {product.discount}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const RecentlyViewedCarousel = () => {
  const { products, isLoading } = useRecentlyViewed();

  if (isLoading) {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="small" color="#ff6b6b" />
      </View>
    );
  }

  if (products.length === 0) {
    return null; // Hide carousel if no recently viewed products
  }

  return (
    <View style={{ marginBottom: 20 }}>
      {/* Section Header */}
      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#333",
          }}
        >
          Recently Viewed
        </Text>
      </View>

      {/* Carousel */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ProductCard product={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
      />
    </View>
  );
};
