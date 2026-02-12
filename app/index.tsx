import { Text, View, ScrollView, SafeAreaView } from "react-native";
import { RecentlyViewedCarousel } from "@/components/RecentlyViewedCarousel";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        {/* Hero Banner */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            backgroundColor: "#f8f8f8",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#333",
            }}
          >
            Welcome to Myntra
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#666",
              marginTop: 4,
            }}
          >
            Explore our latest collection
          </Text>
        </View>

        {/* Recently Viewed Section */}
        <RecentlyViewedCarousel />

        {/* More content can be added here */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#333",
              marginBottom: 12,
            }}
          >
            Featured Collection
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#666",
            }}
          >
            Discover curated products just for you
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
