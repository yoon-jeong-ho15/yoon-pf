import fs from "fs";
import Path from "path";
import matter from "gray-matter";
import type { CategoryTree, NoteMeta } from "@/types";
import { collectNotes } from "@/lib/tree";
import { getMDTree } from "@/lib/markdown-tree";

const ROOT_PATH = Path.join(process.cwd(), "md");

async function getPostBodyBySlug(
  type: string,
  slug: string[],
  rootPath = ROOT_PATH,
): Promise<string | null> {
  const fullPath = Path.join(rootPath, type, ...slug) + ".md";
  const relativePath = Path.relative(rootPath, fullPath);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${Path.sep}`) ||
    Path.isAbsolute(relativePath)
  ) {
    console.warn(`Prevented directory traversal attempt: ${fullPath}`);
    return null;
  }

  let content: string;
  try {
    content = await fs.promises.readFile(fullPath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw new Error(`Failed to read Markdown post body: ${fullPath}`, { cause: error });
  }

  return matter(content).content;
}

export function getAllPostFromTree(tree: CategoryTree[]): NoteMeta[] {
  return collectNotes(tree);
}

export async function getDetailPageData(
  type: string,
  slug: string[],
  rootPath?: string,
): Promise<{ meta: NoteMeta; body: string } | null> {
  const tree = await getMDTree(type, rootPath);
  const targetSlug = slug.join("/");
  const meta = collectNotes(tree).find(
    (note) => note.slug.join("/") === targetSlug,
  );

  if (!meta) return null;

  const body = await getPostBodyBySlug(type, meta.slug, rootPath);
  return body === null ? null : { meta, body };
}

export async function generateMarkdownStaticParams(
  type: string,
  rootPath?: string,
) {
  const tree = await getMDTree(type, rootPath);
  return collectNotes(tree).map(({ slug }) => ({ slug }));
}
