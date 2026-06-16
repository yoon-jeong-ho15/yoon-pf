import TopButton from "@/components/top-button";
import ReviewItem from "@/features/(markdown)/components/reviewitem";
import {
  getMDTree,
  getAllTreeSlugs,
  getTreeItemBySlug,
  getPostBodyBySlug,
} from "@/features/(markdown)/lib/data";
import { markdownToHtml } from "@/features/(markdown)/lib/markdown";
import { NoteMeta } from "@/types";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const tree = await getMDTree("blogs");
  const slugs = getAllTreeSlugs(tree);
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const tree = await getMDTree("blogs");
  const result = getTreeItemBySlug(tree, slug);

  if (!result) return notFound();

  const data = result.data as NoteMeta;
  const body = await getPostBodyBySlug("blogs", slug);
  const content = await markdownToHtml(body || "");

  const isReview = data.slug[0] === "review";

  return (
    <div className="flex-1 flex items-start min-h-screen p-4 mb-16">
      <main className="flex-1 flex flex-col min-h-screen bg-surface border border-default w-full gap-6 py-6">
        <div className="flex justify-center gap-14 items-end">
          <div className="text-5xl font-bold">{data.frontmatter.title}</div>
          <div className="text-xs text-muted">{data.frontmatter.date}</div>
        </div>
        <div className="flex justify-center">
          {isReview && <ReviewItem item={data} />}
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
