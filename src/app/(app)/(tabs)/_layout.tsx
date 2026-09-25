import { Tabs } from "expo-router";

import AddIngredientButton from "@/components/add-ingredient-button";
import SignOutButton from "@/components/sign-out-button";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerRight: () => <SignOutButton /> }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Products",
          headerLeft: () => <AddIngredientButton />,
        }}
      />
      <Tabs.Screen name="myShoppingList" options={{ title: "Shopping" }} />
    </Tabs>
  );
}
