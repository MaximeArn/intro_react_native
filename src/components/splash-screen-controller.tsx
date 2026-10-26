import { SplashScreen } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { colors, spacing, typography } from "@/constants/theme";
import useAddressesStore from "@/stores/addresses.store";
import useAuthStore from "@/stores/auth.store";
import loadingAnimation from "../../assets/lotties/map-pin.json";

const MIN_DURATION_MS = 1500;

// Doit rester égal à imageWidth du splash natif dans app.config.ts
const ANIMATION_WIDTH = 260;
const ANIMATION_HEIGHT = (ANIMATION_WIDTH * 280) / 400;

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const isSignedIn = useAuthStore((state) => !!state.user);
  const isAddressesLoading = useAddressesStore((state) => state.isLoading);
  const [isMinDurationElapsed, setIsMinDurationElapsed] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setIsMinDurationElapsed(true),
      MIN_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  // Sans session, il n'y a pas d'adresses à attendre
  const isDataReady = !isAuthLoading && (!isSignedIn || !isAddressesLoading);

  if (isDataReady && isMinDurationElapsed && !isDone) {
    setIsDone(true);
  }

  useEffect(() => {
    if (isDone) SplashScreen.hide();
  }, [isDone]);

  if (isDone) return null;

  return (
    <Animated.View
      testID="app-splash"
      exiting={FadeOut.duration(350)}
      style={styles.container}
    >
      <LottieView
        source={loadingAnimation}
        autoPlay
        loop
        onAnimationLoaded={() => SplashScreen.hide()}
        style={styles.animation}
      />
      <Animated.View
        entering={FadeIn.delay(200).duration(400)}
        style={styles.texts}
      >
        <Text style={styles.brand}>Mes Bonnes Adresses</Text>
        <Text style={styles.tagline}>Tes lieux favoris, au même endroit.</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // L'animation est centrée seule, exactement comme l'image du splash natif
  // (app.config.ts, imageWidth: 260) : le passage de l'un à l'autre est invisible
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  animation: {
    // Même ratio que l'animation (400 × 280)
    width: ANIMATION_WIDTH,
    height: ANIMATION_HEIGHT,
  },
  // Textes placés sous l'animation, sans décaler son centrage
  texts: {
    position: "absolute",
    top: "50%",
    left: spacing.lg,
    right: spacing.lg,
    marginTop: ANIMATION_HEIGHT / 2 + spacing.md,
  },
  brand: {
    ...typography.title,
    fontSize: 32,
    textAlign: "center",
    color: colors.primary,
  },
  tagline: {
    ...typography.body,
    marginTop: spacing.xs,
    textAlign: "center",
    color: colors.textMuted,
  },
});
