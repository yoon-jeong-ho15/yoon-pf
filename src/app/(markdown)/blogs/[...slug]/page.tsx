import TopButton from "@/components/top-button";
import ReviewItem from "@/components/(markdown)/reviewitem";
import {
  generateMarkdownStaticParams,
  getDetailPageData,
} from "@/lib/data";
import { markdownToHtml } from "@/lib/markdown";
import { notFound } from "next/navigation";

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

  const isReview = meta.slug[0] === "review";

  return (
    <div className="flex-1 flex items-start min-h-screen p-4 mb-16">
      <main className="flex-1 flex flex-col min-h-screen bg-surface border border-default w-full gap-6 py-6">
        <div className="flex justify-center gap-14 items-end">
          <div className="text-5xl font-bold">{meta.frontmatter.title}</div>
          <div className="text-xs text-muted">{meta.frontmatter.date}</div>
        </div>
        <div className="flex justify-center">
          {isReview && <ReviewItem item={meta} />}
        </div>
        <article
          className="prose dark:prose-invert my-8 text-sm max-w-[90dvw] md:max-w-xl lg:max-w-2xl xl:text-base xl:max-w-3xl mx-auto px-4 2xl:px-0"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <TopButton />
      </main>
    </div>
  );
}

