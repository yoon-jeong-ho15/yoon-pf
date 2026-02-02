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
  const description = await markdownToHtml(category?.description || "");
  const content = await markdownToHtml(note?.body || "");

  // Fetch metadata for both category and note frontmatter
  const [categoryMetadata, noteMetadata] = await Promise.all([
    getFrontmatterMetadata(category.frontmatter),
    note ? getFrontmatterMetadata(note.frontmatter) : Promise.resolve({}),
  ]);

  const allMetadata = { ...categoryMetadata, ...noteMetadata };

  return (
    <>
      <Suspense fallback={<div>Loading category...</div>}>
        <CategoryDetail
          category={category}
          descriptionHtml={description}
          metadataMap={allMetadata}
        />
      </Suspense>

      <div className="w-3/4 max-w-none">
        {note && (
          <>
            {sortFrontmatter(note.frontmatter).map(([key, value]) => (
              <Frontmatter
                key={key}
                type="note"
                label={key}
                value={value}
                metadataMap={allMetadata}
              />
            ))}
            <article
              className="prose mt-8 max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </>
        )}
      </div>
    </>
  );
}
