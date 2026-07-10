import { markdownToHtml } from "@/features/(markdown)/lib/markdown";
import {
  getMDTree,
  getAllTreeSlugs,
  getDetailPageData,
} from "@/features/(markdown)/lib/data";
import { getLinkMetadataMap } from "@/features/(markdown)/lib/metadata";
import { MetadataProvider } from "@/components/provider/metadata-provider";

export async function generateStaticParams() {
  const tree = await getMDTree("study-notes");
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

  const data = await getDetailPageData("study-notes", slug);

  if (!data) {
    return notFound();
  }

  let content = "";
  let noteMetadata = {};
  let categoryMetadata = {};

  if (data.kind === "note") {
    content = await markdownToHtml(data.body || "");
    noteMetadata = await getLinkMetadataMap(data.meta.frontmatter);
  } else {
    categoryMetadata = await getLinkMetadataMap(data.node.frontmatter);
  }

  const allMetadata = { ...categoryMetadata, ...noteMetadata };

  return (
    <MetadataProvider metadataMap={allMetadata}>
      <div
        className="flex-1 flex 
          flex-row divide-x
          divide-gray-500 "
      >
        {data.kind === "note" ? (
          <NotePage noteMeta={data.meta} content={content} />
        ) : (
          <CategoryPage categoryNode={data.node} />
        )}
      </div>
    </MetadataProvider>
  );
}

