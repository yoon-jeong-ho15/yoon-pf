import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MetadataProvider } from "../../../components/provider/metadata-provider";
import InfoCard from "./info-card";
import { CategoryFrontmatter, NoteFrontmatter } from "@/types";

const meta = {
  title: "Features / Markdown / InfoCard",
  component: InfoCard,
  decorators: [
    (Story) => (
      <MetadataProvider metadataMap={mockMetadataMap}>
        <div className="">
          <Story />
        </div>
      </MetadataProvider>
    ),
  ],
} satisfies Meta<typeof InfoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Category: Story = {
  args: {
    type: "category",
    frontmatter: {
      title: "6.042j (전산수학)",
      instructor: ["John Doe", "Jane Smith"],
      topic: ["HTML", "CSS", "JavaScript"],
      provide: ["KOCW", "MIT", "Coursera"],
      link: ["https://developer.mozilla.org/en-US/"],
    } as CategoryFrontmatter,
  },
};

export const Note: Story = {
  args: {
    type: "note",
    frontmatter: {
      title: "숫자 외 다른 자료의 표현",
      date: "2024-02-25",
      order: 3,
      link: [
        "https://react.dev/reference/react/use-server",
        "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
      ],
      tags: ["react", "nextjs", "server components", "frontend"],
    } as NoteFrontmatter,
  },
};

const mockMetadataMap = {
  "https://react.dev/reference/react/use-server": {
    url: "https://react.dev/reference/react/use-server",
    title: "React - use server",
    description: "Documentation for React Server Components.",
    image: "https://react.dev/images/og-reference.png",
    icon: "https://react.dev/favicon-32x32.png",
  },
  "https://nextjs.org/docs/app/building-your-application/rendering/server-components":
    {
      url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
      title: "Next.js Server Components",
      description: "Learn how to use Server Components in Next.js App Router.",
      image:
        "https://nextjs.org/api/docs-og?title=Getting%20Started:%20Server%20and%20Client%20Components",
      icon: "https://nextjs.org/favicon.ico",
    },
  "https://developer.mozilla.org/en-US/": {
    url: "https://developer.mozilla.org/en-US/",
    title: "MDN Web Docs",
    description:
      "The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.",
    image: "https://developer.mozilla.org/mdn-social-image.46ac2375.png",
    icon: "https://developer.mozilla.org/favicon.ico",
  },
};
