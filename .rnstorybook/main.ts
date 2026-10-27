import type { StorybookConfig } from "@storybook/react-native";

const main: StorybookConfig = {
  stories: ["../src/components/**/*.stories.?(ts|tsx)"],
};

export default main;
