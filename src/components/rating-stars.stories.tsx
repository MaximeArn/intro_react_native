import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";

import RatingStars from "@/components/rating-stars";

const meta = {
  title: "RatingStars",
  component: RatingStars,
  args: { value: 4 },
} satisfies Meta<typeof RatingStars>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Display: Story = {};

export const HalfStar: Story = {
  args: { value: 3.5 },
};

export const Input: Story = {
  render: function Render() {
    const [value, setValue] = useState(0);
    return <RatingStars value={value} size={40} onChange={setValue} />;
  },
};
