import { markdownToHtml } from "@/features/(markdown)/lib/markdown";
import { getNoteBySlug, getAllSlugs } from "@/features/(markdown)/lib/data";
import CategoryInfo from "../_components/category-info";
import {
  getUrlMetadata,
  LinkMetadata,
} from "@/features/(markdown)/lib/metadata";
import {
  CategoryFrontmatter,
  Domain,
  NoteFrontmatter,
  Series,
  Subject,
} from "@/types";
import SubCategoryList from "../_components/subcategory-list";
import NoteList from "../_components/note-list";
import NoteInfo from "../_components/note-info";

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

  // TODO : refactor
  let mainInfoCategory: Domain | Subject | Series = category;
  let subCategories: (Subject | Series)[] = [];
  let notes = category.notes;
  const sortedNotes = [...notes].sort((a, b) => {
    return (a.frontmatter.order || 0) - (b.frontmatter.order || 0);
  });

  if (type === "domain") {
    const domain = category as Domain;
    subCategories = domain.subjects;
  } else if (type === "subject") {
    const subject = category as Subject;
    subCategories = subject.series;
  } else if (type === "series") {
    const parentSlug = slug.slice(0, 2);
    const parentResult = getNoteBySlug(parentSlug);
    if (parentResult.type === "subject") {
      const parentSubject = parentResult.data.category as Subject;
      mainInfoCategory = parentSubject;
      subCategories = parentSubject.series;
    }
  } else if (type === "note") {
    if ("series" in category) {
      const subject = category as Subject;
      subCategories = subject.series;
    } else if ("subjects" in category) {
      const domain = category as Domain;
      subCategories = domain.subjects;
    } else {
      const parentSlug = slug.slice(0, 2);
      const parentResult = getNoteBySlug(parentSlug);
      if (parentResult.type === "subject") {
        const parentSubject = parentResult.data.category as Subject;
        mainInfoCategory = parentSubject;
        subCategories = parentSubject.series;
      }
    }
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
    <div
      className="flex-1 flex lg:flex-col divide-y divide-gray-500 
          xl:flex-row xl:divide-y-0 xl:divide-x"
    >
      <div
        className={`hidden lg:flex
          h-68 divide-x xl:divide-x-0 xl:divide-y divide-gray-400
          xl:w-80 xl:h-full xl:flex-col
        `}
      >
        <CategoryInfo
          type="desktop"
          mainInfo={mainInfo}
          metadataMap={allMetadata}
        />
        <SubCategoryList
          type="desktop"
          mainInfo={mainInfo}
          subCategories={subCategories}
        />
        <NoteList type="desktop" notes={sortedNotes} />
        <div className="hidden flex-1 xl:flex" />
      </div>

      <div className="flex lg:hidden"></div>

      <div className="hidden xl:block xl:w-5" />
      {note ? (
        <div className="flex-1 flex flex-col divide-y divide-gray-500">
          <NoteInfo frontmatter={note.frontmatter} allMetadata={allMetadata} />
          <article
            className="prose my-8 text-sm max-w-[90dvw] md:max-w-xl lg:max-w-2xl md:text-base xl:max-w-3xl mx-auto px-4 2xl:px-0"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        <div>not found</div>
      )}
    </div>
  );
}
