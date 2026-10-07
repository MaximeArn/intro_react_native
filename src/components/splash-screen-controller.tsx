import { SplashScreen } from "expo-router";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";
import useAuthStore from "@/stores/auth.store";
import loadingAnimation from "../../assets/lotties/map-pin.json";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  if (!isAuthLoading) {
    SplashScreen.hide();
    return null;
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={loadingAnimation}
        autoPlay
        loop
        onAnimationLoaded={() => SplashScreen.hide()}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.background,
  },
  animation: {
    // Même ratio que l'animation (400 × 280)
    width: 240,
    height: 168,
  },
});
