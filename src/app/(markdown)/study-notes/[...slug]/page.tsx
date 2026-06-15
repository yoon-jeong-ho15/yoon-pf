import { markdownToHtml } from "@/features/(markdown)/lib/markdown";
import {
  getMDTree,
  getAllTreeSlugs,
  getTreeItemBySlug,
  getPostBodyBySlug,
} from "@/features/(markdown)/lib/data";
import { getLinkMetadataMap } from "@/features/(markdown)/lib/metadata";
import { MetadataProvider } from "@/components/provider/metadata-provider";

export async function generateStaticParams() {
  const tree = getMDTree("study-notes");
  const slugs = getAllTreeSlugs(tree);
  return slugs.map((slug) => ({
    slug,
  }));
}

import { notFound } from "next/navigation";
import NotePage from "./note";
import CategoryPage from "./category";
import { CategoryTree, NoteMeta } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const tree = getMDTree("study-notes");
  const result = getTreeItemBySlug(tree, slug);

  if (!result) {
    return notFound();
  }

  const { type, data } = result;

  let isNote: boolean;
  let noteMeta: NoteMeta | null;
  let categoryNode: CategoryTree | null;
  let content: string = "";

  if (type === "note") {
    isNote = true;
    noteMeta = data as NoteMeta;
    const noteBody = getPostBodyBySlug("study-notes", slug);
    content = await markdownToHtml(noteBody || "");
    categoryNode = null;
  } else {
    isNote = false;
    noteMeta = null;
    categoryNode = data as CategoryTree;
  }

  const categoryMetadata = categoryNode
    ? await getLinkMetadataMap(categoryNode.frontmatter)
    : {};
  const noteMetadata = noteMeta
    ? await getLinkMetadataMap(noteMeta.frontmatter)
    : {};

  const allMetadata = { ...categoryMetadata, ...noteMetadata };

  return (
    <MetadataProvider metadataMap={allMetadata}>
      <div
        className="flex-1 flex 
          flex-row divide-x
          divide-gray-500 "
      >
        {isNote && noteMeta && (
          <NotePage noteMeta={noteMeta} content={content} />
        )}
        {!isNote && categoryNode && (
          <CategoryPage categoryNode={categoryNode} />
        )}
      </div>
    </MetadataProvider>
  );
}
