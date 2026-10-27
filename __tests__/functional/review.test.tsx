import { fireEvent, render, screen } from "@testing-library/react-native";

import NewReview from "@/app/(app)/addresses/[id]/review";
import { createComment } from "@/services/comments";

jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
  Stack: { Screen: () => null },
  useLocalSearchParams: () => ({ id: "address-1" }),
}));
jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);
jest.mock("@/services/firebase", () => ({}));
jest.mock("@/services/comments", () => ({
  createComment: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Écran « Donner mon avis »", () => {
  test("refuse un avis sans note", async () => {
    await render(<NewReview />);

    await fireEvent.changeText(screen.getByTestId("review-text"), "Très bien");
    await fireEvent.press(screen.getByTestId("review-submit"));

    expect(screen.getByText("Choisis une note.")).toBeOnTheScreen();
    expect(createComment).not.toHaveBeenCalled();
  });

  test("envoie la note et le texte saisis", async () => {
    await render(<NewReview />);

    await fireEvent.press(screen.getByTestId("rating-star-4"));
    await fireEvent.changeText(screen.getByTestId("review-text"), "Très bien");
    await fireEvent.press(screen.getByTestId("review-submit"));

    expect(createComment).toHaveBeenCalledWith("address-1", {
      rating: 4,
      text: "Très bien",
      localPhotoUri: null,
    });
  });
});
