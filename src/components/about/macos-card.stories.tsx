import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MacosCard } from "../about/macos-card";
import React from "react";

const meta: Meta<typeof MacosCard> = {
  title: "UI/MacosCard",
  component: MacosCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MacosCard>;

export const Default: Story = {
  args: {
    title: "macOS Window",
    children: (
      <div className="w-80">
        <p className="text-sm mb-4">
          This is a reusable MacosCard component. It wraps the DraggableCard component to provide macOS window controls and styles.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors">
          Click Me
        </button>
      </div>
    ),
  },
};

export const CustomContainer: Story = {
  args: {
    title: "Constrained Card",
    containerSelector: "#story-container",
    children: (
      <div className="w-80">
        <p className="text-sm">
          This card is configured to only drag within an element with the ID <code>#story-container</code>.
        </p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div
        id="story-container"
        className="w-[600px] h-[400px] border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center relative rounded-lg"
      >
        <div className="absolute top-2 left-2 text-xs text-gray-400">#story-container</div>
        <Story />
      </div>
    ),
  ],
};
