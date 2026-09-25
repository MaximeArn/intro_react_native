import { Tabs } from "expo-router";

import SignOutButton from "@/components/sign-out-button";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerRight: () => <SignOutButton /> }}>
      <Tabs.Screen name="index" options={{ title: "Products" }} />
      <Tabs.Screen name="myShoppingList" options={{ title: "Shopping" }} />
    </Tabs>
  );
}
