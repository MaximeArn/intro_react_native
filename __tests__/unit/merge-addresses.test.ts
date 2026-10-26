import { mergeAddresses } from "@/utils/merge-addresses";
import { makeAddress } from "../../test-utils/fixtures";

describe("mergeAddresses", () => {
  test("ne garde qu'une fois une adresse présente dans les deux listes", () => {
    const myPublicAddress = makeAddress({ id: "1" });

    const result = mergeAddresses([myPublicAddress], [myPublicAddress]);

    expect(result).toHaveLength(1);
  });

  test("trie les adresses de la plus récente à la plus ancienne", () => {
    const old = makeAddress({ id: "old", createdAt: new Date("2026-01-01") });
    const recent = makeAddress({
      id: "recent",
      createdAt: new Date("2026-10-01"),
    });

    const result = mergeAddresses([old], [recent]);

    expect(result.map((address) => address.id)).toEqual(["recent", "old"]);
  });
});
