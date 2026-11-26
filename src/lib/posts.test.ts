import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import * as markdownTree from "./markdown-tree";
import { generateMarkdownStaticParams, getDetailPageData } from "./posts";

const nestedCategory = ["guides", "nested"];
const nestedSlug = [...nestedCategory, "post"];
const emptySlug = ["guides", "empty"];
const body = "Nested post body.\n";

let root: string;
let nestedPostPath: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "blog-posts-"));
  const guidesPath = join(root, "blogs", "guides");
  const nestedPath = join(guidesPath, "nested");
  nestedPostPath = join(nestedPath, "post.md");
  await mkdir(nestedPath, { recursive: true });
  await Promise.all([
    writeFile(join(nestedPath, "index.md"), "Category description.\n"),
    writeFile(nestedPostPath, `---\ntitle: Nested post\n---\n${body}`),
    writeFile(join(guidesPath, "empty.md"), "---\ntitle: Empty post\n---\n"),
  ]);
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(root, { recursive: true, force: true });
});

test("generates params for all notes, including nested notes", async () => {
  await expect(generateMarkdownStaticParams("blogs", root)).resolves.toEqual([
    { slug: emptySlug },
    { slug: nestedSlug },
  ]);
  await expect(getDetailPageData("blogs", nestedSlug, root)).resolves.toMatchObject({
    meta: { slug: nestedSlug, frontmatter: { title: "Nested post" } },
    body,
  });
});

test("returns no detail for a category with an index file", async () => {
  await expect(getDetailPageData("blogs", nestedCategory, root)).resolves.toBeNull();
});

test("returns an empty string for a note with no body", async () => {
  await expect(getDetailPageData("blogs", emptySlug, root)).resolves.toMatchObject({
    meta: { slug: emptySlug },
    body: "",
  });
});

test("returns no detail when a note file disappears after the tree is read", async () => {
  const tree = await markdownTree.getMDTree("blogs", root);
  await rm(nestedPostPath);
  vi.spyOn(markdownTree, "getMDTree").mockResolvedValueOnce(tree);

  await expect(getDetailPageData("blogs", nestedSlug, root)).resolves.toBeNull();
});

test("propagates other read failures with the file path and original cause", async () => {
  const tree = await markdownTree.getMDTree("blogs", root);
  await rm(nestedPostPath);
  await mkdir(nestedPostPath);
  vi.spyOn(markdownTree, "getMDTree").mockResolvedValueOnce(tree);

  await expect(getDetailPageData("blogs", nestedSlug, root)).rejects.toMatchObject({
    message: expect.stringContaining(nestedPostPath),
    cause: { code: "EISDIR" },
  });
});
