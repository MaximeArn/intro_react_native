import { filterAddresses } from "@/utils/address-filters";
import { makeAddress } from "../../test-utils/fixtures";

describe("filterAddresses", () => {
  const myPublic = makeAddress({ id: "1", ownerId: "me", isPublic: true });
  const myPrivate = makeAddress({ id: "2", ownerId: "me", isPublic: false });
  const othersPublic = makeAddress({ id: "3", ownerId: "bob", isPublic: true });
  const addresses = [myPublic, myPrivate, othersPublic];

  test("« all » garde toutes les adresses visibles", () => {
    expect(filterAddresses(addresses, "all", "me")).toEqual(addresses);
  });

  test("« mine » garde mes adresses publiques et privées", () => {
    expect(filterAddresses(addresses, "mine", "me")).toEqual([
      myPublic,
      myPrivate,
    ]);
  });

  test("« community » garde uniquement les adresses publiques des autres", () => {
    expect(filterAddresses(addresses, "community", "me")).toEqual([
      othersPublic,
    ]);
  });

  test("« community » exclut une adresse privée d'un autre utilisateur", () => {
    const othersPrivate = makeAddress({ ownerId: "bob", isPublic: false });
    expect(filterAddresses([othersPrivate], "community", "me")).toEqual([]);
  });

  test("sans utilisateur, « mine » est vide", () => {
    expect(filterAddresses(addresses, "mine", undefined)).toEqual([]);
  });
});
