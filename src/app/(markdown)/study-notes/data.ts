import fs from "fs";
import Path from "path";
import matter from "gray-matter";
import { Note, NoteFrontmatter, Category, CategoryFrontmatter } from "@/types";

const STUDY_NOTES_PATH = Path.join(process.cwd(), "md", "study-notes");

export function getCategoryTree(): Category[] {
  const files = fs
    .readdirSync(STUDY_NOTES_PATH)
    .filter((file) => !file.startsWith(".") && !file.startsWith("_"));

  const categories = files.map((file) => {
    const path = Path.join(STUDY_NOTES_PATH, file);
    return getCategory(path);
  });

  return categories;
}

function getCategory(path: string): Category {
  const files = fs
    .readdirSync(path)
    .filter((file) => !file.startsWith(".") && !file.startsWith("_"));

  const currentSlug = Path.relative(STUDY_NOTES_PATH, path).split(Path.sep);
  const { indexPath, notePaths, folderPaths } = splitPath(files, path);

  const index = getCategoryIndex(indexPath);
  const notes = getCategoryNotes(notePaths);
  const subCategories = folderPaths.map((folderPath) =>
    getCategory(folderPath)
  );

  return {
    frontmatter: index.frontmatter,
    description: index.description,
    slug: currentSlug,
    subCategories,
    notes,
  };
}

function splitPath(files: string[], path: string) {
  let indexFile = files.find((file) => file.endsWith("index.md"));
  if (!indexFile) {
    const defaultIndexContent = `---
title: ${Path.basename(path)}
---
`;
    const newIndexPath = Path.join(path, "index.md");
    fs.writeFileSync(newIndexPath, defaultIndexContent);
    indexFile = "index.md";
  }
  const indexPath = Path.join(path, indexFile);

  const notePaths = files
    .filter((file) => file !== "index.md" && file.endsWith(".md"))
    .map((file) => Path.join(path, file));

  const folderPaths = files
    .filter((file) => file !== "index.md" && !file.endsWith(".md"))
    .map((file) => Path.join(path, file));

  return { indexPath, notePaths, folderPaths };
}

function getCategoryIndex(indexPath: string) {
  const { data, content } = matter(fs.readFileSync(indexPath, "utf8"));

  return {
    frontmatter: data as CategoryFrontmatter,
    description: content as string,
  };
}

function getCategoryNotes(notePaths: string[]): Note[] {
  return notePaths.map((path) => {
    const { data, content } = matter(fs.readFileSync(path, "utf8"));
    const slug = Path.relative(STUDY_NOTES_PATH, path)
      .replace(/\.md$/, "")
      .split(Path.sep);

    return {
      frontmatter: {
        ...(data as any),
        date:
          data.date instanceof Date
            ? data.date.toISOString().split("T")[0]
            : data.date,
      } as NoteFrontmatter,
      slug,
      body: content,
    };
  });
}

export function getAllSlugs(): string[][] {
  const categories = getCategoryTree();
  const slugs: string[][] = [];

  function traverse(categories: Category[]) {
    for (const category of categories) {
      slugs.push(category.slug);
      for (const note of category.notes) {
        slugs.push(note.slug);
      }
      traverse(category.subCategories);
    }
  }

  traverse(categories);
  return slugs;
}

export function getNoteBySlug(slug: string[]) {
  const path = Path.join(STUDY_NOTES_PATH, ...slug);
  const exists = fs.existsSync(path);

  if (exists && fs.statSync(path).isDirectory()) {
    return { type: "category", data: { category: getCategory(path) } };
  } else {
    const notePath = path + ".md";
    if (fs.existsSync(notePath)) {
      const { data, content } = matter(fs.readFileSync(notePath, "utf8"));
      const note = {
        frontmatter: {
          ...(data as any),
          date:
            data.date instanceof Date
              ? data.date.toISOString().split("T")[0]
              : data.date,
        } as NoteFrontmatter,
        slug: slug,
        body: content,
      };

      const parentPath = Path.join(STUDY_NOTES_PATH, ...slug.slice(0, -1));
      const parentCategory = getCategory(parentPath);

      return { type: "note", data: { category: parentCategory, note } };
    }
  }

  throw new Error(`Slug not found: ${slug.join("/")}`);
}
