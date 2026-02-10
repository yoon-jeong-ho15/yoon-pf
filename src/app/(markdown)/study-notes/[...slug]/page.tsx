import { markdownToHtml } from "@/lib/markdown";
import { getNoteBySlug, getAllSlugs } from "../_lib/data";
import CategoryInfo from "../_components/category-info";
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
import PostItem from "../_components/post-item";
import SubCategoryItem from "../_components/sub-category-item";
import Link from "next/link";

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
    <>
      <div
        className={`flex min-w-64
          h-68 divide-x xl:divide-x-0 xl:divide-y divide-gray-400
          xl:h-full xl:flex-col xl:bg-transparent xl:w-1/5
        `}
      >
        <CategoryInfo mainInfo={mainInfo} metadataMap={allMetadata} />

        <div
          className="w-1/5 xl:w-full flex flex-col xl:justify-center items-center 
            divide-y divide-gray-500 text-slate-600"
        >
          <Link
            href={`/study-notes/${mainInfo.slug.join("/")}`}
            className="py-2 pl-3 w-full flex items-center gap-1 border-dashed
            "
          >
            <span>
              {mainInfo.title} ({mainInfo.count})
            </span>
          </Link>
          {subCategories.length > 0 ? (
            <ul className="overflow-y-scroll scrollbar-minimal flex flex-col w-full h-full max-h-48 xl:max-h-none">
              {subCategories.map((subItem) => (
                <SubCategoryItem
                  key={subItem.slug.join("/")}
                  title={subItem.frontmatter.title}
                  noteCount={subItem.notes.length}
                  slug={subItem.slug}
                />
              ))}
            </ul>
          ) : (
            <div className="w-full flex justify-center items-center py-2 text-sm text-gray-500 h-full">
              하위 분류 없음
            </div>
          )}
        </div>

        <div className="flex flex-col w-1/3 xl:w-full border-r-0">
          <div
            className="flex items-center py-2 pl-3 
          border-b border-dashed border-gray-500
          text-slate-600"
          >
            노트
          </div>
          <ul
            className="flex flex-col 
          overflow-y-scroll scrollbar-minimal bg-white/30"
          >
            {sortedNotes.map((note, i) => (
              <PostItem
                key={note.slug.join("/")}
                title={note.frontmatter.title}
                order={note.frontmatter.order}
                slug={note.slug}
                i={i}
              />
            ))}
          </ul>
        </div>

        <div className="hidden flex-1 xl:flex" />
      </div>

      {note ? (
        <div className="flex-1 flex flex-col divide-y divide-gray-500">
          <div className="flex flex-col justify-center pl-12 h-36 xl:h-46 bg-linear-to-l from-green-400 to-lime-200">
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
