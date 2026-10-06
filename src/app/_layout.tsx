import { DefaultTheme, Stack, ThemeProvider } from "expo-router";

import { colors } from "@/constants/theme";
import { SplashScreenController } from "@/splash";
import useAuthStore from "../stores/auth.store";

// Couleurs appliquées aux headers, tab bar et fonds des écrans
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function Root() {
  return (
    <ThemeProvider value={navigationTheme}>
      <RootNavigator />
      {/* Après le navigateur pour s'afficher par-dessus */}
      <SplashScreenController />
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { user } = useAuthStore();

  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
