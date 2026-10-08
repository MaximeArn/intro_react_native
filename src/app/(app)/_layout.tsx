import { Stack } from "expo-router";
import { useEffect } from "react";

import { colors } from "@/constants/theme";
import useAddressesStore from "@/stores/addresses.store";
import useAuthStore from "@/stores/auth.store";

export default function RootLayout() {
  const userId = useAuthStore((state) => state.user?.uid);
  const subscribeToAddresses = useAddressesStore((state) => state.subscribe);

  useEffect(() => {
    if (!userId) return;
    return subscribeToAddresses(userId);
  }, [userId, subscribeToAddresses]);

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: "700", color: colors.text },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="addresses/new"
        options={{ presentation: "modal", title: "Nouvelle adresse" }}
      />
      <Stack.Screen name="addresses/[id]" options={{ title: "" }} />
    </Stack>
  );
}
