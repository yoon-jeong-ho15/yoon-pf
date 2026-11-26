import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { DEFAULT_IMAGE_FALLBACK } from "@/lib/image-fallback";
import ImageWithFallback from "./image-with-fallback";

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
    alt: "Broken image triggering fallback",
    unoptimized: true,
    onError: fn(),
    width: 400,
    height: 300,
    className: "rounded-lg shadow-md border-2 border-red-500",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const img = canvas.getByRole<HTMLImageElement>("img", {
      name: /triggering fallback/i,
    });
    const fallbackUrl = new URL(DEFAULT_IMAGE_FALLBACK, img.baseURI).href;

    await waitFor(async () => {
      await expect(img.currentSrc).toBe(fallbackUrl);
      await expect(img.complete).toBe(true);
      await expect(img.naturalWidth).toBeGreaterThan(0);
    });
    await expect(args.onError).toHaveBeenCalled();
  },
};
