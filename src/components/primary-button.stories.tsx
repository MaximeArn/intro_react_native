import type { Meta, StoryObj } from "@storybook/react-native";

import PrimaryButton from "@/components/primary-button";

const meta = {
  title: "PrimaryButton",
  component: PrimaryButton,
  args: {
    label: "Se connecter",
    onPress: () => {},
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};
