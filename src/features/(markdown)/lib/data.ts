import fs from "fs";
import Path from "path";
import matter from "gray-matter";
import { cache } from "react";
import {
  CategoryFrontmatter,
  CategoryTree,
  NoteFrontmatter,
  NoteMeta,
} from "@/types";

const ROOT_PATH = Path.join(process.cwd(), "md");

export const getMDTree = cache((type: string): CategoryTree[] => {
  const dirPath = Path.join(ROOT_PATH, type);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs
    .readdirSync(dirPath)
    .filter((file) => !file.startsWith(".") && !file.startsWith("_"));

  const tree: CategoryTree[] = [];

  for (const file of files) {
    const fullPath = Path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      tree.push(parseCategoryDirectory(fullPath));
    }
  }

  return tree;
});

function parseCategoryDirectory(dirPath: string): CategoryTree {
  const dirName = Path.basename(dirPath);
  const currentSlug = Path.relative(ROOT_PATH, dirPath)
    .split(Path.sep)
    .slice(1);

  const files = fs
    .readdirSync(dirPath)
    .filter((file) => !file.startsWith(".") && !file.startsWith("_"));

  let categoryFrontmatter: CategoryFrontmatter = { title: dirName };
  let categoryDescription: string | undefined = undefined;

  const notes: NoteMeta[] = [];
  const children: CategoryTree[] = [];

  for (const file of files) {
    const fullPath = Path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      children.push(parseCategoryDirectory(fullPath));
    } else if (file.endsWith(".md")) {
      const fileContent = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContent);

      if (file === "index.md") {
        categoryFrontmatter = data as CategoryFrontmatter;
        categoryDescription = content;
      } else {
        const slug = Path.relative(ROOT_PATH, fullPath)
          .replace(/\.md$/, "")
          .split(Path.sep)
          .slice(1);

        notes.push({
          frontmatter: {
            ...data,
            date:
              data.date instanceof Date
                ? data.date.toISOString().substring(0, 10)
                : String(data.date || ""),
          } as NoteFrontmatter,
          slug,
        });
      }
    }
  }

  notes.sort((a, b) => {
    if (a.frontmatter.order !== undefined && b.frontmatter.order !== undefined)
      return Number(a.frontmatter.order) - Number(b.frontmatter.order);
    if (a.frontmatter.order !== undefined) return -1;
    if (b.frontmatter.order !== undefined) return 1;
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });

  return {
    slug: currentSlug,
    children,
    notes,
    frontmatter: categoryFrontmatter,
    description: categoryDescription,
  };
}

export function getPostBodyBySlug(type: string, slug: string[]): string | null {
  const fullPath = Path.join(ROOT_PATH, type, ...slug) + ".md";
  if (fs.existsSync(fullPath)) {
    const { content } = matter(fs.readFileSync(fullPath, "utf8"));
    return content;
  }
  return null;
}

export function getAllTreeSlugs(tree: CategoryTree[]): string[][] {
  const slugs: string[][] = [];

  function traverse(node: CategoryTree) {
    slugs.push(node.slug);
    for (const note of node.notes) {
      slugs.push(note.slug);
    }
    for (const child of node.children) {
      traverse(child);
    }
  }

  for (const root of tree) {
    traverse(root);
  }

  return slugs;
}

export function getTreeItemBySlug(
  tree: CategoryTree[],
  slug: string[],
):
  | { type: "category"; data: CategoryTree }
  | { type: "note"; data: NoteMeta }
  | null {
  const targetSlug = slug.join("/");

  function traverse(
    node: CategoryTree,
  ):
    | { type: "category"; data: CategoryTree }
    | { type: "note"; data: NoteMeta }
    | null {
    if (node.slug.join("/") === targetSlug) {
      return { type: "category", data: node };
    }

    const note = node.notes.find((n) => n.slug.join("/") === targetSlug);
    if (note) {
      return { type: "note", data: note };
    }

    for (const child of node.children) {
      const found = traverse(child);
      if (found) return found;
    }

    return null;
  }

  for (const root of tree) {
    const found = traverse(root);
    if (found) return found;
  }

  return null;
}

export function searchStudyNotes(
  tree: CategoryTree[],
  query: string,
): { matchedCategories: CategoryTree[]; matchedNotes: NoteMeta[] } {
  const matchedCategories: CategoryTree[] = [];
  const matchedNotes: NoteMeta[] = [];

  if (!query) return { matchedCategories, matchedNotes };

  const lowerQuery = query.toLowerCase();

  const matchField = (field: string | string[] | undefined) => {
    if (!field) return false;
    if (Array.isArray(field)) {
      return field.some((f) => f.toLowerCase().includes(lowerQuery));
    }
    if (typeof field === "string") {
      return field.toLowerCase().includes(lowerQuery);
    }
    return false;
  };

  const traverse = (node: CategoryTree) => {
    const catFrontmatter = node.frontmatter;
    const catMatch =
      catFrontmatter.title.toLowerCase().includes(lowerQuery) ||
      matchField(catFrontmatter.topic) ||
      matchField(catFrontmatter.provide) ||
      matchField(catFrontmatter.instructor);

    if (catMatch) {
      matchedCategories.push(node);
    }

    for (const note of node.notes) {
      const noteFrontmatter = note.frontmatter;
      const noteMatch =
        noteFrontmatter.title.toLowerCase().includes(lowerQuery) ||
        matchField(noteFrontmatter.tags);

      if (noteMatch) {
        matchedNotes.push(note);
      }
    }

    for (const child of node.children) {
      traverse(child);
    }
  };

  for (const root of tree) {
    traverse(root);
  }

  return { matchedCategories, matchedNotes };
}
