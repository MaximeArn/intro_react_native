import { SplashScreen } from "expo-router";
import useAuthStore from "./stores/auth.store";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuthStore();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}
