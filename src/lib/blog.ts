import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Base directory for blog posts
const BLOG_DIR = path.join(process.cwd(), "md/blogs");

export interface BlogPost {
  slug: string[];
  slugString: string; // "category/subcategory/title"
  content: string;
  frontmatter: {
    [key: string]: any;
    title?: string;
    date?: string;
  };
}

/**
 * Recursively finds all markdown files in the blog directory,
 * ignoring folders/files starting with '_' or '.'
 */
export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  // Ensure directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  function traverse(currentPath: string, slugSegments: string[]) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      // Ignore excluded files/folders
      if (item.startsWith("_") || item.startsWith(".")) continue;

      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath, [...slugSegments, item]);
      } else if (stat.isFile() && item.endsWith(".md")) {
        const fileName = item.replace(/\.md$/, "");
        const finalSlug = [...slugSegments, fileName];

        try {
          const fileContents = fs.readFileSync(fullPath, "utf8");
          const { data, content } = matter(fileContents);

          posts.push({
            slug: finalSlug,
            slugString: finalSlug.join("/"),
            content,
            frontmatter: data,
          });
        } catch (error) {
          console.error(`Error reading markdown file: ${fullPath}`, error);
        }
      }
    }
  }

  traverse(BLOG_DIR, []);

  // Sort posts by date descending
  return posts.sort((a, b) => {
    if (a.frontmatter.date && b.frontmatter.date) {
      return (
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
      );
    }
    return 0;
  });
}

export function getBlogPostBySlug(slug: string[]): BlogPost | null {
  try {
    const filePath = path.join(BLOG_DIR, ...slug) + ".md";

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      slugString: slug.join("/"),
      content,
      frontmatter: data,
    };
  } catch (error) {
    console.error(`Error getting blog post by slug: ${slug}`, error);
    return null;
  }
}
