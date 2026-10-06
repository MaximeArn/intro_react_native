import { SplashScreen } from "expo-router";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import { colors } from "./constants/theme";
import useAuthStore from "./stores/auth.store";
import useIngredientsStore from "./stores/ingredients.store";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const isDataLoading = useIngredientsStore((state) => state.isLoading);

  if (!isAuthLoading && !isDataLoading) {
    SplashScreen.hide();
    return null;
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/loading.lottie")}
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
    width: 180,
    height: 180,
  },
});
