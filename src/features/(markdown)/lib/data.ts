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
import { walkTree, collectNotes } from "../utils/tree-utils";

const ROOT_PATH = Path.join(process.cwd(), "md");

const isValidFile = (file: string) =>
  !file.startsWith(".") && !file.startsWith("_");

async function resolveThumbnail(
  fileName: string,
  priority: "thumbnail" | "item",
): Promise<string> {
  const extensions = [".jpg", ".webp", ".png", ".jpeg", ".gif"];
  const dirs =
    priority === "thumbnail" ? ["thumbnails", "item"] : ["item", "thumbnails"];

  for (const dir of dirs) {
    for (const ext of extensions) {
      const fullPath = Path.join(process.cwd(), "public", dir, `${fileName}${ext}`);
      try {
        await fs.promises.stat(fullPath);
        return `/${dir}/${fileName}${ext}`;
      } catch {
        // File does not exist, continue loop
      }
    }
  }
  return "/empty.png";
}

export const getMDTree = cache(async (type: string): Promise<CategoryTree[]> => {
  const dirPath = Path.join(ROOT_PATH, type);

  try {
    await fs.promises.access(dirPath, fs.constants.F_OK);
  } catch {
    return [];
  }

  const files = (await fs.promises.readdir(dirPath)).filter(isValidFile);
  const tree: CategoryTree[] = [];

  for (const file of files) {
    const fullPath = Path.join(dirPath, file);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      tree.push(await parseCategoryDirectory(fullPath));
    }
  }

  return tree;
});

async function parseCategoryDirectory(dirPath: string): Promise<CategoryTree> {
  const dirName = Path.basename(dirPath);
  const currentSlug = Path.relative(ROOT_PATH, dirPath)
    .split(Path.sep)
    .slice(1);

  const files = (await fs.promises.readdir(dirPath)).filter(isValidFile);

  let categoryFrontmatter: CategoryFrontmatter = { title: dirName };
  let categoryDescription: string | undefined = undefined;

  const notes: NoteMeta[] = [];
  const children: CategoryTree[] = [];

  for (const file of files) {
    const fullPath = Path.join(dirPath, file);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      children.push(await parseCategoryDirectory(fullPath));
    } else if (file.endsWith(".md")) {
      const fileContent = await fs.promises.readFile(fullPath, "utf8");
      const { data, content } = matter(fileContent);

      if (file === "index.md") {
        categoryFrontmatter = data as CategoryFrontmatter;
        categoryDescription = content;
      } else {
        const slug = Path.relative(ROOT_PATH, fullPath)
          .replace(/\.md$/, "")
          .split(Path.sep)
          .slice(1);

        const fileName = slug[slug.length - 1];
        const thumbnail = await resolveThumbnail(fileName, "thumbnail");
        const itemImage = await resolveThumbnail(fileName, "item");

        notes.push({
          frontmatter: {
            ...data,
            date:
              data.date instanceof Date
                ? data.date.toISOString().substring(0, 10)
                : String(data.date || ""),
          } as NoteFrontmatter,
          slug,
          thumbnail,
          itemImage,
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

export async function getPostBodyBySlug(
  type: string,
  slug: string[],
): Promise<string | null> {
  const fullPath = Path.join(ROOT_PATH, type, ...slug) + ".md";

  // Safe path traversal check
  if (!fullPath.startsWith(ROOT_PATH)) {
    console.warn(`Prevented directory traversal attempt: ${fullPath}`);
    return null;
  }

  try {
    const content = await fs.promises.readFile(fullPath, "utf8");
    const parsed = matter(content);
    return parsed.content;
  } catch {
    return null;
  }
}

export function getAllTreeSlugs(tree: CategoryTree[]): string[][] {
  const slugs: string[][] = [];

  walkTree(tree, (node) => {
    slugs.push(node.slug);
    if (node.notes) {
      for (const note of node.notes) {
        slugs.push(note.slug);
      }
    }
  });

  return slugs;
}

export function getAllPostFromTree(tree: CategoryTree[]): NoteMeta[] {
  return collectNotes(tree);
}

export function getTreeItemBySlug(
  tree: CategoryTree[],
  slug: string[],
):
  | { type: "category"; data: CategoryTree }
  | { type: "note"; data: NoteMeta }
  | null {
  const targetSlug = slug.join("/");
  let result:
    | { type: "category"; data: CategoryTree }
    | { type: "note"; data: NoteMeta }
    | null = null;

  walkTree(tree, (node) => {
    if (node.slug.join("/") === targetSlug) {
      result = { type: "category", data: node };
      return false; // stop traversal
    }
    if (node.notes) {
      const note = node.notes.find((n) => n.slug.join("/") === targetSlug);
      if (note) {
        result = { type: "note", data: note };
        return false; // stop traversal
      }
    }
  });

  return result;
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

  walkTree(tree, (node) => {
    const catFrontmatter = node.frontmatter;
    const catMatch =
      catFrontmatter.title.toLowerCase().includes(lowerQuery) ||
      matchField(catFrontmatter.topic) ||
      matchField(catFrontmatter.provide) ||
      matchField(catFrontmatter.instructor);

    if (catMatch) {
      matchedCategories.push(node);
    }

    if (node.notes) {
      for (const note of node.notes) {
        const noteFrontmatter = note.frontmatter;
        const noteMatch =
          noteFrontmatter.title.toLowerCase().includes(lowerQuery) ||
          matchField(noteFrontmatter.tags);

        if (noteMatch) {
          matchedNotes.push(note);
        }
      }
    }
  });

  return { matchedCategories, matchedNotes };
}

export type DetailPageData =
  | { kind: "note"; meta: NoteMeta; body: string | null }
  | { kind: "category"; node: CategoryTree };

export async function getDetailPageData(
  type: string,
  slug: string[],
): Promise<DetailPageData | null> {
  const tree = await getMDTree(type);
  const result = getTreeItemBySlug(tree, slug);

  if (!result) return null;

  if (result.type === "note") {
    const body = await getPostBodyBySlug(type, slug);
    return {
      kind: "note",
      meta: result.data as NoteMeta,
      body,
    };
  }

  return {
    kind: "category",
    node: result.data as CategoryTree,
  };
}

