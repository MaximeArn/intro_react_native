import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Header />
      <Stack.Screen name="index" options={{ title: "Ingredients" }} />
      <Stack.Screen name="ingredients/[ingredientId]" />
    </Stack>
  );
}
