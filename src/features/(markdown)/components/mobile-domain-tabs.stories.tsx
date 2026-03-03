import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within, fireEvent, expect, userEvent, fn } from "@storybook/test";

import MobileDomainTabs from "./mobile-domain-tabs";

const meta: Meta<typeof MobileDomainTabs> = {
  title: "Components / MobileDomainUl",
  component: MobileDomainTabs,
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-2 w-[480px] overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    domains: [
      {
        slug: ["domain1"],
        frontmatter: {
          title: "Domain 1",
        },
      },
      {
        slug: ["domain2"],
        frontmatter: {
          title: "Domain 2",
        },
      },
      {
        slug: ["domain3"],
        frontmatter: {
          title: "Domain 3",
        },
      },
    ],
    showingDomain: { slug: ["domain3"], frontmatter: { title: "Domain 3" } },
    setActiveSelection: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const domain2Button = canvas.getByText("Domain 2");
    await userEvent.click(domain2Button);

    expect(args.setActiveSelection).toHaveBeenCalledWith({
      type: "domain",
      slug: ["domain2"],
    });
  },
};

export const Scroll: Story = {
  args: {
    domains: [
      {
        slug: ["domain1"],
        frontmatter: {
          title: "Domain 1",
        },
      },
      {
        slug: ["domain2"],
        frontmatter: {
          title: "Domain 2",
        },
      },
      {
        slug: ["domain3"],
        frontmatter: {
          title: "Domain 3",
        },
      },
      {
        slug: ["domain4"],
        frontmatter: {
          title: "Domain 4",
        },
      },
      {
        slug: ["domain5"],
        frontmatter: {
          title: "Domain 5",
        },
      },
      {
        slug: ["domain6"],
        frontmatter: {
          title: "Domain 6",
        },
      },
      {
        slug: ["domain7"],
        frontmatter: {
          title: "Domain 7",
        },
      },
    ],
    showingDomain: { slug: ["domain1"], frontmatter: { title: "Domain 1" } },
    setActiveSelection: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const listElement = canvas.getByRole("list");

    expect(listElement.scrollLeft).toBe(0);

    fireEvent.wheel(listElement, { deltaY: 200 });

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(listElement.scrollLeft).toBeGreaterThan(0);
  },
};
