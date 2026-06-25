import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HoverCard } from "./hover-card";
import { expect, within, userEvent } from "@storybook/test";

const meta: Meta<typeof HoverCard> = {
  title: "UI/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "text",
      description: "The HTML tag to render as the wrapper",
    },
    className: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  args: {
    children: (
      <span className="text-blue-500 underline cursor-pointer">
        Hover over me
      </span>
    ),
    content: (
      <div className="bg-surface border border-default p-4 rounded shadow-lg w-64">
        <h4 className="font-bold text-sm mb-1">Hover Card Details</h4>
        <p className="text-xs text-text-secondary">
          This is the content that appears when you hover over the trigger element. It is rendered in a portal.
        </p>
      </div>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step("Hover triggers content", async () => {
      const trigger = canvas.getByText("Hover over me");
      await userEvent.hover(trigger);
      
      // The content is rendered in a portal outside the canvas root,
      // so we use document.body to find it
      const portalContent = within(document.body).getByText("Hover Card Details");
      await expect(portalContent).toBeInTheDocument();
      
      await userEvent.unhover(trigger);
    });
  },
};
