import type { Address } from "@/types/address";

export function mergeAddresses(
  publicAddresses: Address[],
  ownAddresses: Address[],
): Address[] {
  const byId = new Map<string, Address>();
  for (const address of [...publicAddresses, ...ownAddresses]) {
    byId.set(address.id, address);
  }

  return [...byId.values()].sort(
    (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
}
