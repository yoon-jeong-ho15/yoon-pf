import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ImageWithFallback from "./image-with-fallback";
import { expect, fireEvent, fn, waitFor, within } from "storybook/test";

const meta: Meta<typeof ImageWithFallback> = {
  title: "UI/ImageWithFallback",
  component: ImageWithFallback,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    src: { control: "text" },
    fallbackSrc: { control: "text" },
    alt: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ImageWithFallback>;

export const DefaultValid: Story = {
  args: {
    src: "/s.jpg",
    fallbackSrc: "/empty.png",
    alt: "A valid placeholder image",
    width: 400,
    height: 300,
    className: "rounded-lg shadow-md",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const img = canvas.getByRole("img", { name: /valid placeholder/i });
    await expect(img).toBeInTheDocument();
    await expect(img).toHaveAttribute("src");
  },
};

export const FallbackTriggered: Story = {
  args: {
    src: "/missing-fallback-test-image.png",
    fallbackSrc: "/empty.png",
    alt: "Broken image triggering fallback",
    unoptimized: true,
    onError: fn(),
    width: 400,
    height: 300,
    className: "rounded-lg shadow-md border-2 border-red-500",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const img = canvas.getByRole("img", { name: /triggering fallback/i });
    await expect(img).toBeInTheDocument();
    fireEvent.error(img);
    await waitFor(() => expect(new URL((img as HTMLImageElement).src).pathname).toBe("/empty.png"));
    await expect(args.onError).toHaveBeenCalled();
  },
};
