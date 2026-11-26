import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vitest";
import { getMDTree } from "./markdown-tree";

test("normalizes frontmatter when reading categories and notes", async () => {
  const root = await mkdtemp(join(tmpdir(), "markdown-tree-"));

  try {
    const categoryPath = join(root, "blogs", "review");
    await mkdir(categoryPath, { recursive: true });
    const links = ["https://example.com/first", "https://example.com/second"];

    await Promise.all([
      writeFile(
        join(categoryPath, "index.md"),
        "---\nlink: https://example.com/category\ntags: [reading, reviews]\n---\nCategory description\n",
      ),
      writeFile(
        join(categoryPath, "zulu.md"),
        [
          "---",
          "order: 2",
          "date: 2024-01-02",
          "tags: fiction",
          "link:",
          ...links.map((link) => `  - ${link}`),
          "author: Octavia Butler",
          "---",
        ].join("\n"),
      ),
      writeFile(
        join(categoryPath, "alpha.md"),
        '---\ntitle: "  "\norder: 10\ndate: "2024.01.03"\n---\n',
      ),
      writeFile(join(categoryPath, "first.md"), "---\ntitle: Zebra\n---\n"),
      writeFile(join(categoryPath, "last.md"), "---\ntitle: Beta\n---\n"),
    ]);

    const [category] = await getMDTree("blogs", root);

    expect(category?.frontmatter).toEqual({
      title: "review",
      link: ["https://example.com/category"],
      tags: ["reading", "reviews"],
    });
    expect(category.description).toBe("Category description\n");
    expect(category.notes.map(({ frontmatter }) => frontmatter.title)).toEqual([
      "zulu",
      "alpha",
      "Beta",
      "Zebra",
    ]);

    const [first, second] = category.notes;
    expect(first.frontmatter).toEqual({
      title: "zulu",
      order: 2,
      date: "2024-01-02",
      tags: ["fiction"],
      link: links,
      author: "Octavia Butler",
    });
    expect(second.frontmatter).toEqual({
      title: "alpha",
      order: 10,
      date: "2024.01.03",
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
