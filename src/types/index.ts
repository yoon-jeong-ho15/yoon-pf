export type MD_TYPE = "blogs" | "study-notes";

export type CategoryFrontmatter = {
  title: string;
  link?: string[];
  topic?: string[];
  instructor?: string[];
  chapter?: string;
};

export type Series = {
  frontmatter: CategoryFrontmatter;
  description: string;
  slug: string[];
  notes: {
    frontmatter: NoteFrontmatter;
    slug: string[];
  }[];
};

export type Subject = {
  frontmatter: CategoryFrontmatter;
  description: string;
  slug: string[];
  series: Series[];
  notes: {
    frontmatter: NoteFrontmatter;
    slug: string[];
  }[];
};

export type Domain = {
  frontmatter: CategoryFrontmatter;
  description: string;
  slug: string[];
  subjects: Subject[];
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

export type BlogFrontmatter = {
  title: string;
  date: string;
};

export type Blog = {
  frontmatter: BlogFrontmatter;
  slug: string[];
  body: string;
};
