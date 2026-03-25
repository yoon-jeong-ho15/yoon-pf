export type MD_TYPE = "blogs" | "study-notes";

export type CategoryFrontmatter = {
  title: string;
  link?: string[];
  topic?: string[];
  instructor?: string[];
  chapter?: string;
};

export type NoteFrontmatter = {
  title: string;
  date: string;
  order?: number;
  link?: string[];
  tags?: string[];
};

export type BlogFrontmatter = {
  title: string;
  date: string;
};

export type Blog = {
  frontmatter: BlogFrontmatter;
  slug: string[];
  body: string;
};

export type NoteMeta = {
  frontmatter: NoteFrontmatter;
  slug: string[];
};

export type CategoryTree = {
  frontmatter: CategoryFrontmatter;
  slug: string[];
  children: CategoryTree[];
  notes: NoteMeta[];
  description?: string;
};

export type LinkMetadata = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
};
