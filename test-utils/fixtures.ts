import type { Address } from "@/types/address";

export const makeAddress = (overrides: Partial<Address> = {}): Address => ({
  id: "address-1",
  ownerId: "me",
  ownerName: "Moi",
  name: "La boulangerie",
  description: "",
  photoURL: null,
  isPublic: true,
  location: { latitude: 45.76, longitude: 4.83 },
  formattedAddress: null,
  createdAt: new Date("2026-10-01T10:00:00Z"),
  ...overrides,
});
