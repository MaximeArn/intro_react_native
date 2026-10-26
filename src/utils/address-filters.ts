import type { Address } from "@/types/address";

export type AddressFilter = "all" | "mine" | "community";

export function filterAddresses(
  addresses: Address[],
  filter: AddressFilter,
  userId: string | undefined,
): Address[] {
  if (filter === "mine") {
    return addresses.filter((address) => address.ownerId === userId);
  }
  if (filter === "community") {
    return addresses.filter(
      (address) => address.isPublic && address.ownerId !== userId,
    );
  }
  return addresses;
}
