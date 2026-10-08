import type { Region } from "react-native-maps";

import type { Coordinates } from "@/hooks/use-user-location";

// Vue sur la France tant que la position n'est pas connue
export const DEFAULT_REGION: Region = {
  latitude: 46.6,
  longitude: 2.4,
  latitudeDelta: 9,
  longitudeDelta: 9,
};

// Zoom « quartier » autour d'un point
export const regionAround = (
  { latitude, longitude }: Coordinates,
  delta = 0.02,
): Region => ({
  latitude,
  longitude,
  latitudeDelta: delta,
  longitudeDelta: delta,
});
