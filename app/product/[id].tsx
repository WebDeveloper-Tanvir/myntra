import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { Ionicons } from "@expo/vector-icons";

interface ProductDetail {
  _id: string;
  name: string;
  brand: string;
  price: number;
  discount?: string;
  description?: string;
  sizes?: string[];
  images: string[];
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get(
          `https://myntra-clone-xj36.onrender.com/product/${id}`
        );
        const productData = response.data.product || response.data;
        setProduct(productData);

        // Track this product as recently viewed
        if (productData) {
          await addToRecentlyViewed({
            _id: productData._id,
            name: productData.name,
            brand: productData.brand,
            price: productData.price,
            discount: productData.discount,
            description: productData.description,
            sizes: productData.sizes,
            images: productData.images || [],
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, addToRecentlyViewed]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "#666" }}>Product not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Text style={{ color: "#ff6b6b", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 18, fontWeight: "700", marginLeft: 12, color: "#333" }}>
            Product Details
          </Text>
        </View>

        {/* Main Image */}
        <View
          style={{
            width: "100%",
            aspectRatio: 1,
            backgroundColor: "#f5f5f5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: product.images?.[selectedImage] || "https://via.placeholder.com/400",
            }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
          />
        </View>

        {/* Thumbnail Images */}
        {product.images && product.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 16, paddingVertical: 12 }}
            contentContainerStyle={{ gap: 8 }}
          >
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(index)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 4,
                  borderWidth: selectedImage === index ? 2 : 0,
                  borderColor: selectedImage === index ? "#ff6b6b" : "transparent",
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: image }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover",
                  }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Product Info */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          {/* Brand and Name */}
          <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
            {product.brand}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 8 }}>
            {product.name}
          </Text>

          {/* Price */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#333" }}>
              ₹{product.price}
            </Text>
            {product.discount && (
              <Text style={{ fontSize: 14, color: "#ff6b6b", fontWeight: "600" }}>
                {product.discount}
              </Text>
            )}
          </View>

          {/* Description */}
          {product.description && (
            <Text style={{ fontSize: 14, color: "#666", lineHeight: 20, marginBottom: 16 }}>
              {product.description}
            </Text>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" }}>
                Select Size
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: selectedSize === size ? "#ff6b6b" : "#ddd",
                      backgroundColor: selectedSize === size ? "#fff5f5" : "#fff",
                    }}
                  >
                    <Text
                      style={{
                        color: selectedSize === size ? "#ff6b6b" : "#333",
                        fontWeight: selectedSize === size ? "600" : "500",
                      }}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#ff6b6b",
              paddingVertical: 14,
              borderRadius: 4,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              Add to Cart
            </Text>
          </TouchableOpacity>

          {/* Wishlist Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#f5f5f5",
              paddingVertical: 14,
              borderRadius: 4,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#333", fontSize: 16, fontWeight: "700" }}>
              ♡ Add to Wishlist
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
