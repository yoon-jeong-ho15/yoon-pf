import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DraggableCard } from "./draggable-card";
import React from "react";

const meta: Meta<typeof DraggableCard> = {
  title: "UI/DraggableCard",
  component: DraggableCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DraggableCard>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-surface border border-default p-6 w-80 shadow-md">
        <DraggableCard.Handle>
          <h2 className="text-lg font-bold mb-2 drag-handle cursor-grab active:cursor-grabbing">:: Drag Me Anywhere</h2>
        </DraggableCard.Handle>
        <p className="text-sm text-text-secondary">
          Click and hold on the title above to drag this card. Double-click the title to reset it.
        </p>
      </div>
    ),
  },
};

export const CustomHandle: Story = {
  args: {
    children: (
      <div className="bg-surface border border-default w-80 shadow-md">
        <DraggableCard.Handle className="bg-layout-bg border-b border-default p-2 cursor-grab active:cursor-grabbing flex justify-between items-center">
          <span className="font-bold text-sm">:: Drag Handle Title</span>
          <span className="text-xs text-text-muted">Drag here</span>
        </DraggableCard.Handle>
        <div className="p-4">
          <p className="text-sm mb-2">
            This card can only be dragged using the header handle above.
          </p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-blue-600 border border-blue-500 px-2 py-0.5 rounded text-sm hover:bg-amber-200"
          >
            Interactive Button
          </a>
        </div>
      </div>
    ),
  },
};
