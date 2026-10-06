import { fireEvent } from "@testing-library/react-native";
import { renderRouter, screen } from "expo-router/testing-library";
import { Pressable, View, Text } from "react-native";

describe("navigation tests", () => {
  // Mocked view on every route
  const MockComponent = jest.fn(() => (
    <View>
      <Pressable>
        <Text>Navigate</Text>
      </Pressable>
    </View>
  ));

  // Mocked router
  const router = renderRouter(
    {
      index: MockComponent,
      "directory/a": MockComponent,
      "(group)/b": MockComponent,
    },
    {
      initialUrl: "/directory/a",
    },
  );

  test("initial page is the right one", async () => {
    await router;
    expect(router.getPathname()).toBe("/directory/a");
  });
});
