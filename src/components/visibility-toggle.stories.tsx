import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";

import VisibilityToggle from "@/components/visibility-toggle";

const meta = {
  title: "VisibilityToggle",
  component: VisibilityToggle,
  args: {
    isPublic: false,
    onChange: () => {},
  },
} satisfies Meta<typeof VisibilityToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Private: Story = {};

export const Public: Story = {
  args: { isPublic: true },
};

export const Interactive: Story = {
  render: function Render() {
    const [isPublic, setIsPublic] = useState(false);
    return <VisibilityToggle isPublic={isPublic} onChange={setIsPublic} />;
  },
};
