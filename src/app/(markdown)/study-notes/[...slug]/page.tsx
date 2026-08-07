import { markdownToHtml } from "@/lib/markdown";
import {
  generateMarkdownStaticParams,
  getDetailPageData,
} from "@/lib/data";
import { getLinkMetadataMap } from "@/lib/metadata";
import { MetadataProvider } from "@/hooks/useMetadata";

export async function generateStaticParams() {
  return generateMarkdownStaticParams("study-notes");
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
    noteMetadata = await getLinkMetadataMap(data.meta.frontmatter.link);
  } else {
    categoryMetadata = await getLinkMetadataMap(data.node.frontmatter.link);
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

