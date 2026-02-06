import { Suspense } from "react";
import { markdownToHtml } from "@/lib/markdown";
import { getNoteBySlug, getAllSlugs } from "../_lib/data";
import CategoryDetail from "../_components/category-detail";
import Frontmatter from "../../_components/frontmatter";
import { sortFrontmatter } from "../_lib/util";
import { getUrlMetadata, LinkMetadata } from "@/lib/metadata";
import {
  CategoryFrontmatter,
  Domain,
  NoteFrontmatter,
  Series,
  Subject,
} from "@/types";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

async function getFrontmatterMetadata(
  frontmatter: CategoryFrontmatter | NoteFrontmatter,
) {
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
  const { type, data } = getNoteBySlug(slug);

  const note = type === "note" ? data.note : null;
  const category = data.category;

  // TODO: fix type
  const activeNotes = category!.notes;

  const content = await markdownToHtml(note?.body || "");

  // TODO: fix type
  const categoryMetadata = await getFrontmatterMetadata(category!.frontmatter);
  const noteMetadata = note
    ? await getFrontmatterMetadata(note.frontmatter)
    : {};

  const allMetadata = { ...categoryMetadata, ...noteMetadata };

  return (
    <>
      <div
        className={`flex min-w-64 mb-6 bg-white/30
          h-68 divide-x xl:divide-x-0 xl:divide-y divide-gray-400
          xl:h-full xl:flex-col xl:bg-transparent xl:w-1/5
        `}
      >
        <CategoryDetail
          category={category}
          notes={activeNotes}
          metadataMap={allMetadata}
        />
      </div>

      {note ? (
        <div className="flex-1 flex flex-col divide-y divide-slate-500">
          <div className="flex flex-col justify-center pl-12 h-36 xl:h-46">
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
            className="prose my-8 max-w-3xl mx-auto px-10 xl:px-4 2xl:px-0"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        <div>not found</div>
      )}
    </>
  );
}
