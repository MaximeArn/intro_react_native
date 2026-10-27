import { fireEvent, render, screen } from "@testing-library/react-native";

import SignUp from "@/app/sign-up";
import { createUserWithEmailAndPassword } from "@/services/firebase";

jest.mock("@/services/firebase", () => ({
  auth: {},
  onAuthStateChanged: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

describe("Écran d'inscription", () => {
  test("refuse deux mots de passe différents", async () => {
    await render(<SignUp />);

    await fireEvent.changeText(
      screen.getByTestId("sign-up-display-name-input"),
      "Jean",
    );
    await fireEvent.changeText(
      screen.getByTestId("sign-up-email-input"),
      "jean@test.com",
    );
    await fireEvent.changeText(
      screen.getByTestId("sign-up-password-input"),
      "motdepasse1",
    );
    await fireEvent.changeText(
      screen.getByTestId("sign-up-password-confirm-input"),
      "motdepasse2",
    );
    await fireEvent.press(screen.getByTestId("sign-up-button"));

    expect(
      screen.getByText("Les mots de passe ne correspondent pas."),
    ).toBeOnTheScreen();
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });
});
