import { fireEvent, render, screen } from "@testing-library/react-native";
import SignIn from "../src/app/sign-in";

// Mock de Firebase
jest.mock("@react-native-firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve("Mocked user")),
  signOut: jest.fn(() => Promise.resolve()),
}));
jest.mock("@react-native-firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
}));

describe("signin flow", () => {
  test("sign user in", async () => {
    await render(<SignIn />);

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const signInButton = screen.getByTestId("sign-in-button");

    await fireEvent.changeText(emailInput, "test@test.com");
    await fireEvent.changeText(passwordInput, "password123");
    await fireEvent.press(signInButton);
  });
});
