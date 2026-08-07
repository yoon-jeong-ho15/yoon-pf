import TopButton from "@/components/top-button";
import ReviewItem from "@/components/(markdown)/reviewitem";
import {
  generateMarkdownStaticParams,
  getDetailPageData,
} from "@/lib/data";
import { markdownToHtml } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { MetadataProvider } from "@/hooks/useMetadata";
import { getLinkMetadataMap } from "@/lib/metadata";
import ThoughtPage from "./thought";
import ReviewPage from "./review";

export async function generateStaticParams() {
  return generateMarkdownStaticParams("blogs");
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const data = await getDetailPageData("blogs", slug);

  if (!data || data.kind !== "note") return notFound();

  const { meta, body } = data;
  const content = await markdownToHtml(body || "");
  const metadataMap = await getLinkMetadataMap(meta.frontmatter.link);
  const isReview = meta.slug[0] === "review";

  return (
    <MetadataProvider metadataMap={metadataMap}>
      {isReview ? <ReviewPage meta={meta} content={content} />
        : <ThoughtPage meta={meta} content={content} />}
    </MetadataProvider>
  );
}

