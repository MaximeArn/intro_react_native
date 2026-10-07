import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

import { spacing } from "@/constants/theme";
import mapPinAnimation from "../../assets/lotties/map-pin.json";

export default function MapPinAnimation() {
  return (
    <LottieView
      source={mapPinAnimation}
      autoPlay
      loop
      style={styles.animation}
    />
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 220,
    height: 154,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
});
