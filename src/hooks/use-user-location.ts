import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationStatus = "loading" | "granted" | "denied";

const toCoordinates = ({ coords }: Location.LocationObject): Coordinates => ({
  latitude: coords.latitude,
  longitude: coords.longitude,
});

export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>("loading");
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);

  const locate = useCallback(async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    setCanAskAgain(permission.canAskAgain);
    if (!permission.granted) {
      setStatus("denied");
      return null;
    }
    setStatus("granted");

    let position: Coordinates | null = null;
    try {
      // Dernière position connue : instantanée, affinée juste après
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) {
        position = toCoordinates(lastKnown);
        setCoords(position);
      }
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      position = toCoordinates(current);
      setCoords(position);
    } catch {}
    return position;
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    locate();
  }, [locate]);

  return { status, coords, canAskAgain, locate };
}
