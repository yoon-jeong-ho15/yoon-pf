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

  const isNote = type === "note";
  const noteMeta = isNote ? data : null;
  const categoryNode = isNote ? null : data;

  const noteBody = isNote ? getPostBodyBySlug("study-notes", slug) : null;
  const content = await markdownToHtml(noteBody || "");

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
