import fs from "fs";
import Path from "path";
import matter from "gray-matter";
import { cache } from "react";
import {
  CategoryFrontmatter,
  CategoryTree,
  MD_TYPE,
  NoteFrontmatter,
  NoteMeta,
} from "@/types";

const STUDY_NOTES_PATH = Path.join(process.cwd(), "md", "study-notes");

export const getStudyNotesTree = cache(
  (dirPath: string = STUDY_NOTES_PATH): CategoryTree[] => {
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
  },
);

function parseCategoryDirectory(dirPath: string): CategoryTree {
  const dirName = Path.basename(dirPath);
  const currentSlug = Path.relative(STUDY_NOTES_PATH, dirPath).split(Path.sep);

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
        const slug = Path.relative(STUDY_NOTES_PATH, fullPath)
          .replace(/\.md$/, "")
          .split(Path.sep);

        notes.push({
          frontmatter: data as NoteFrontmatter,
          slug,
        });
      }
    }
  }

  notes.sort((a, b) => {
    if (a.frontmatter.order !== undefined && b.frontmatter.order !== undefined)
      return a.frontmatter.order - b.frontmatter.order;
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

export function getPostBodyBySlug(slug: string[]): string | null {
  const fullPath = Path.join(STUDY_NOTES_PATH, ...slug) + ".md";
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
