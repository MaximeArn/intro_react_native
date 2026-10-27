import type { Preview } from "@storybook/react-native";
import { View } from "react-native";

import { colors, spacing } from "@/constants/theme";

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={{ padding: spacing.md, backgroundColor: colors.background }}>
        <Story />
      </View>
    ),
  ],
};

export default preview;
