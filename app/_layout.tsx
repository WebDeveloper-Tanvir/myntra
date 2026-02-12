import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RecentlyViewedProvider>
        <Stack />
      </RecentlyViewedProvider>
    </AuthProvider>
  );
}
