import { Suspense } from "react";
import { markdownToHtml } from "@/lib/markdown";
import { getNoteBySlug, getAllSlugs } from "../_lib/data";
import CategoryDetail from "../_components/category-detail";
import Frontmatter from "../../_components/frontmatter";
import { sortFrontmatter } from "../_lib/util";
import { getUrlMetadata, LinkMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

async function getFrontmatterMetadata(frontmatter: Record<string, any>) {
  const links = frontmatter.link || [];
  if (!Array.isArray(links)) return {};

  const metadataMap: Record<string, LinkMetadata> = {};
  await Promise.all(
    links.map(async (url: string) => {
      metadataMap[url] = await getUrlMetadata(url);
    }),
  );
  return metadataMap;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const { data } = getNoteBySlug(slug);
  const { category, note } = data;
  const content = await markdownToHtml(note?.body || "");

  // Fetch metadata for both category and note if they exist
  const categoryMetadata = await getFrontmatterMetadata(category.frontmatter);
  const noteMetadata = note
    ? await getFrontmatterMetadata(note.frontmatter)
    : {};

  const allMetadata = { ...categoryMetadata, ...noteMetadata };

  return (
    <div
      id=""
      className="flex-1 flex flex-col divide-y divide-gray-500 
      xl:flex-row xl:divide-x"
    >
      <div
        className={`flex min-w-64 mb-6 bg-white/30
          h-86 divide-x xl:divide-x-0 xl:divide-y divide-gray-400
          xl:h-full xl:flex-col xl:bg-transparent xl:w-1/5
        `}
      >
        <CategoryDetail category={category} metadataMap={allMetadata} />
      </div>
      {note && (
        <>
          <div>
            {sortFrontmatter(note.frontmatter).map(([key, value]) => (
              <Frontmatter
                key={key}
                type="note"
                label={key}
                value={value}
                metadataMap={allMetadata}
              />
            ))}
          </div>
          <article
            className="prose mt-8 max-w-3xl mx-auto px-10 xl:px-4 2xl:px-0"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      )}
    </div>
  );
}
