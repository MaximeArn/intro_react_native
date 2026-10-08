import type { LocationGeocodedAddress } from "expo-location";

export function formatGeocodedAddress(
  place: LocationGeocodedAddress | undefined,
): string | null {
  if (!place) return null;
  if (place.formattedAddress) return place.formattedAddress;

  const street = [place.streetNumber, place.street ?? place.name]
    .filter(Boolean)
    .join(" ");
  const city = [place.postalCode, place.city].filter(Boolean).join(" ");
  const result = [street, city].filter(Boolean).join(", ");
  return result || null;
}
