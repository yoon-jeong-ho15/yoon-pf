export type MD_TYPE = "blogs" | "study-notes";

export type CategoryFrontmatter = {
  title: string;
  link?: string[];
  topic?: string[];
  instructor?: string[];
};

export type Category = {
  frontmatter: CategoryFrontmatter;
  description: string;
  slug: string[];
  subCategories: Category[];
  notes: {
    frontmatter: NoteFrontmatter;
    slug: string[];
  }[];
};

export type NoteFrontmatter = {
  title: string;
  date: string;
  order?: number;
  link?: string[];
  tags?: string[];
};

export type Note = {
  frontmatter: NoteFrontmatter;
  slug: string[];
  body: string;
};
