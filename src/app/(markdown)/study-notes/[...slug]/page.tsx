import { markdownToHtml } from "@/features/(markdown)/lib/markdown";
import {
  getNoteBySlug,
  getAllSlugs,
  getSubjectNotesBySlug,
} from "@/features/(markdown)/lib/data";
import {
  getUrlMetadata,
  LinkMetadata,
} from "@/features/(markdown)/lib/metadata";
import { MetadataProvider } from "@/components/provider/metadata-provider";
import {
  CategoryFrontmatter,
  Domain,
  Note,
  NoteFrontmatter,
  Series,
  Subject,
} from "@/types";
import { d2Coding } from "@/app/fonts";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

import { notFound } from "next/navigation";
import NoteSidebar from "@/features/(markdown)/study-notes/components/note-sidebar";
import { sortFrontmatter } from "@/features/(markdown)/utils/util";
import TopButton from "@/components/top-button";

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

  let result;
  try {
    result = getNoteBySlug(slug);
  } catch (error) {
    return notFound();
  }

  const { type, data } = result;

  const note = type === "note" ? data.note : null;
  const category = data.category;

  let mainInfoCategory: Domain | Subject | Series = category;
  let subCategories: (Subject | Series)[] = [];
  let showingNotes: Note[] = [];

  let notes;
  if (type === "subject") {
    notes = [
      ...category.notes,
      ...(category as Subject).series.flatMap((s) => s.notes),
    ];
  } else {
    notes = category.notes;
  }

  const sortedNotes = [...notes].sort((a, b) => {
    return (a.frontmatter.order || 0) - (b.frontmatter.order || 0);
  });

  switch (type) {
    case "domain":
      mainInfoCategory = category as Domain;
      subCategories = (category as Domain).subjects;
      showingNotes = notes;
      break;
    case "subject":
      mainInfoCategory = category as Subject;
      subCategories = (category as Subject).series;
      showingNotes = getSubjectNotesBySlug(slug.slice(0, 2));
      break;
    case "series":
    case "note":
      // For Series or notes, use the parent Subject context for the sidebar
      const parentSlug = slug.slice(0, 2);
      const parentResult = getNoteBySlug(parentSlug);
      if (parentResult.type === "subject") {
        const parentSubject = parentResult.data.category as Subject;
        mainInfoCategory = parentSubject;
        subCategories = parentSubject.series;
        showingNotes = getSubjectNotesBySlug(parentSlug);
      }
      break;
  }

  const mainInfo = {
    title: mainInfoCategory.frontmatter.title,
    description: mainInfoCategory.description,
    frontmatter: mainInfoCategory.frontmatter,
    slug: mainInfoCategory.slug,
    count: mainInfoCategory.notes.length,
  };

  const content = await markdownToHtml(note?.body || "");

  const categoryMetadata = await getFrontmatterMetadata(
    mainInfoCategory.frontmatter,
  );
  const noteMetadata = note
    ? await getFrontmatterMetadata(note.frontmatter)
    : {};

  const allMetadata = { ...categoryMetadata, ...noteMetadata };

  return (
    <MetadataProvider metadataMap={allMetadata}>
      <div
        className="flex-1 flex 
          flex-row divide-x
          divide-gray-500 "
      >
        <div className="flex flex-col">
          <NoteSidebar
            mainInfo={mainInfo}
            subCategories={subCategories}
            notes={sortedNotes}
          />
          <div className="hidden border-t border-gray-500 xl:flex xl:flex-1" />
        </div>

        {note ? (
          <div
            className={`${d2Coding.className} flex-1 flex flex-col divide-y divide-gray-500 font-medium`}
          >
            <div className="text-green-800 p-5 space-y-2 text-xl">
              {sortFrontmatter(note.frontmatter).map(([key, value]) => (
                <div key={key} className="">
                  <span>{key}</span>
                  <span>{" : "}</span>
                  <span>{`"${value}"`}</span>
                </div>
              ))}
            </div>
            <article
              className="prose my-8 pt-5 text-sm max-w-[90dvw] md:max-w-xl lg:max-w-2xl md:text-base xl:max-w-3xl mx-auto px-4 2xl:px-0"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <TopButton />
          </div>
        ) : (
          <div
            className={`${d2Coding.className} flex flex-1 p-4 italic text-xl text-green-800`}
          >
            <span>{`// description : ${mainInfo.description}`}</span>
          </div>
        )}
      </div>
    </MetadataProvider>
  );
}
