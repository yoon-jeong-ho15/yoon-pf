import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FrontmatterListComponent from "./frontmatter-list";
import { NoteFrontmatter, CategoryFrontmatter } from "@/types";
import { MetadataProvider } from "./metadata-provider";

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

const meta = {
  title: "Features / Markdown / FrontmatterList",
  component: FrontmatterListComponent,
  parameters: {
    layout: "padded",
  },
  args: {
    frontmatter: {
      title: "Sample Note",
      date: "2024-01-01",
    } as NoteFrontmatter,
  },
  argTypes: {
    frontmatter: {
      control: "object",
    },
  },
  decorators: [
    (Story) => (
      <MetadataProvider metadataMap={mockMetadataMap}>
        <div className="w-full max-w-4xl p-4 bg-blue-200 min-h-[300px]">
          <Story />
        </div>
      </MetadataProvider>
    ),
  ],
} satisfies Meta<typeof FrontmatterListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Mock Data ---

const sampleNoteFrontmatter: NoteFrontmatter = {
  title: "React Server Components Guide",
  date: "2024-02-25",
  order: 1,
  link: [
    "https://react.dev/reference/react/use-server",
    "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
  ],
  tags: ["react", "nextjs", "server components", "frontend"],
};

const sampleCategoryFrontmatter: CategoryFrontmatter = {
  title: "Frontend Development",
  chapter: "1",
  instructor: ["John Doe", "Jane Smith"],
  topic: ["HTML", "CSS", "JavaScript"],
  link: ["https://developer.mozilla.org/en-US/"],
};

export const CategoryType: Story = {
  args: {
    type: "category",
    frontmatter: sampleCategoryFrontmatter,
  },
};

export const NoteType: Story = {
  args: {
    type: "note",
    frontmatter: sampleNoteFrontmatter,
  },
};
