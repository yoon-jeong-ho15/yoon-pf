import fs from "fs";
import Path from "path";
import matter from "gray-matter";
import { cache } from "react";
import {
  CategoryFrontmatter,
  CategoryTree,
  NoteMeta,
} from "@/types";
import {
  normalizeFrontmatter,
  normalizeNoteFrontmatter,
} from "@/lib/frontmatter";
import { resolveThumbnail } from "@/lib/image-resolver";

const ROOT_PATH = Path.join(process.cwd(), "md");

const isValidFile = (file: string) =>
  !file.startsWith(".") && !file.startsWith("_");

export const getMDTree = cache(async (
  type: string,
  rootPath = ROOT_PATH,
): Promise<CategoryTree[]> => {
  const dirPath = Path.join(rootPath, type);

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
      tree.push(await parseCategoryDirectory(fullPath, rootPath));
    }
  }

  return tree;
});

async function parseCategoryDirectory(
  dirPath: string,
  rootPath: string,
): Promise<CategoryTree> {
  const dirName = Path.basename(dirPath);
  const currentSlug = Path.relative(rootPath, dirPath)
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
      children.push(await parseCategoryDirectory(fullPath, rootPath));
    } else if (file.endsWith(".md")) {
      const fileContent = await fs.promises.readFile(fullPath, "utf8");
      const { data, content } = matter(fileContent);

      if (file === "index.md") {
        categoryFrontmatter = normalizeFrontmatter(data, dirName);
        categoryDescription = content;
      } else {
        const slug = Path.relative(rootPath, fullPath)
          .replace(/\.md$/, "")
          .split(Path.sep)
          .slice(1);

        const fileName = slug[slug.length - 1];
        const thumbnail = await resolveThumbnail(fileName, "thumbnail");
        const itemImage = await resolveThumbnail(fileName, "item");

        notes.push({
          frontmatter: normalizeNoteFrontmatter(data, fileName),
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
