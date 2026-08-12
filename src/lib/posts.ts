import fs from "fs";
import Path from "path";
import matter from "gray-matter";
import { CategoryTree, NoteMeta } from "@/types";
import { walkTree, collectNotes } from "@/lib/tree";
import { getMDTree } from "@/lib/markdown-tree";

const ROOT_PATH = Path.join(process.cwd(), "md");

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

export async function generateMarkdownStaticParams(type: string) {
  const tree = await getMDTree(type);
  const slugs = getAllTreeSlugs(tree);
  return slugs.map((slug) => ({
    slug,
  }));
}
