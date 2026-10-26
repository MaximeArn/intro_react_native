import { DEFAULT_ERROR_MESSAGE, getErrorMessage } from "@/utils/error-messages";

describe("getErrorMessage", () => {
  test("traduit un code Firebase connu", () => {
    expect(getErrorMessage({ code: "auth/invalid-credential" })).toBe(
      "Email ou mot de passe incorrect.",
    );
    expect(getErrorMessage({ code: "firestore/permission-denied" })).toBe(
      "Tu n'as pas l'autorisation de faire ça.",
    );
  });

  test("utilise le message de repli pour un code inconnu", () => {
    expect(
      getErrorMessage({ code: "auth/unknown" }, "Connexion impossible."),
    ).toBe("Connexion impossible.");
  });

  test("utilise le message par défaut sans code ni repli", () => {
    expect(getErrorMessage(new Error("boom"))).toBe(DEFAULT_ERROR_MESSAGE);
    expect(getErrorMessage(null)).toBe(DEFAULT_ERROR_MESSAGE);
    expect(getErrorMessage(undefined)).toBe(DEFAULT_ERROR_MESSAGE);
  });
});
