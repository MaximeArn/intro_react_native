import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="ingredients/new"
        options={{ title: "Nouveau produit" }}
      />
    </Stack>
  );
}
