import { fireEvent, render, screen } from "@testing-library/react-native";

import SignIn from "@/app/sign-in";
import { signInWithEmailAndPassword } from "@/services/firebase";

jest.mock("@/services/firebase", () => ({
  auth: {},
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

describe("Écran de connexion", () => {
  test("demande de remplir les champs vides", async () => {
    await render(<SignIn />);

    await fireEvent.press(screen.getByTestId("sign-in-button"));

    expect(
      screen.getByText("Renseigne ton email et ton mot de passe."),
    ).toBeOnTheScreen();
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  test("affiche un message clair si le mot de passe est faux", async () => {
    jest
      .mocked(signInWithEmailAndPassword)
      .mockRejectedValue({ code: "auth/invalid-credential" });
    await render(<SignIn />);

    await fireEvent.changeText(screen.getByTestId("email-input"), "a@b.com");
    await fireEvent.changeText(screen.getByTestId("password-input"), "faux");
    await fireEvent.press(screen.getByTestId("sign-in-button"));

    expect(
      await screen.findByText("Email ou mot de passe incorrect."),
    ).toBeOnTheScreen();
  });
});
