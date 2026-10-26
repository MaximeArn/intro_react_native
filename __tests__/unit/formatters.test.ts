import type { LocationGeocodedAddress } from "expo-location";

import { formatGeocodedAddress } from "@/utils/format-address";
import { formatLongDate, formatMonthYear } from "@/utils/format-date";

const place = (
  fields: Partial<LocationGeocodedAddress>,
): LocationGeocodedAddress => ({
  city: null,
  district: null,
  streetNumber: null,
  street: null,
  region: null,
  subregion: null,
  country: null,
  postalCode: null,
  name: null,
  isoCountryCode: null,
  timezone: null,
  formattedAddress: null,
  ...fields,
});

describe("formatGeocodedAddress", () => {
  test("compose « numéro rue, code postal ville »", () => {
    expect(
      formatGeocodedAddress(
        place({
          streetNumber: "12",
          street: "Rue de Rivoli",
          postalCode: "75004",
          city: "Paris",
        }),
      ),
    ).toBe("12 Rue de Rivoli, 75004 Paris");
  });

  test("privilégie l'adresse complète fournie par Android", () => {
    expect(
      formatGeocodedAddress(
        place({
          formattedAddress: "Place Bellecour, 69002 Lyon",
          city: "Lyon",
        }),
      ),
    ).toBe("Place Bellecour, 69002 Lyon");
  });

  test("utilise le nom du lieu quand il n'y a pas de rue", () => {
    expect(
      formatGeocodedAddress(
        place({
          name: "Place des Terreaux",
          postalCode: "69001",
          city: "Lyon",
        }),
      ),
    ).toBe("Place des Terreaux, 69001 Lyon");
  });

  test("renvoie null sans information exploitable", () => {
    expect(formatGeocodedAddress(undefined)).toBeNull();
    expect(formatGeocodedAddress(place({}))).toBeNull();
  });
});

describe("formatLongDate", () => {
  test("formate une date en français", () => {
    expect(formatLongDate(new Date(2026, 9, 8))).toBe("8 octobre 2026");
  });

  test("renvoie null pour une date absente ou invalide", () => {
    expect(formatLongDate(null)).toBeNull();
    expect(formatLongDate(new Date("invalide"))).toBeNull();
  });
});

describe("formatMonthYear", () => {
  test("accepte une date ISO ou un timestamp en millisecondes", () => {
    const date = new Date(2026, 9, 8);
    expect(formatMonthYear(date.toISOString())).toBe("octobre 2026");
    expect(formatMonthYear(String(date.getTime()))).toBe("octobre 2026");
  });

  test("renvoie null pour une valeur vide ou invalide", () => {
    expect(formatMonthYear(undefined)).toBeNull();
    expect(formatMonthYear("")).toBeNull();
    expect(formatMonthYear("pas une date")).toBeNull();
  });
});
