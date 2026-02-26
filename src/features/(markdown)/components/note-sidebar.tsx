import { CategoryFrontmatter, Note, Series, Subject } from "@/types";
import InfoCard from "./info-card";
import PostItem from "./post-item";
import Link from "next/dist/client/link";
import SubCategoryItem from "./sub-category-item";
import { BookOpenIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function NoteSidebar({
  mainInfo,
  subCategories,
  notes,
}: {
  mainInfo: {
    title: string;
    description: string;
    frontmatter: CategoryFrontmatter;
    slug: string[];
    count: number;
  };
  subCategories: (Subject | Series)[];
  notes: Note[];
}) {
  const sortedNotes = [...notes].sort((a, b) => {
    return (a.frontmatter.order || 0) - (b.frontmatter.order || 0);
  });

  const isSubCategoryEmpty = subCategories.length === 0;

  return (
    <div
      id={"note-sidebar"}
      className={`hidden text-sm
        md:h-64 md:w-full md:grid md:grid-flow-col md:grid-cols-3 md:grid-rows-1 
        xl:w-72 xl:h-210 xl:grid-flow-row xl:grid-rows-3 xl:grid-cols-1 
        divide-gray-500
        md:divide-x 
        xl:divide-x-0 xl:divide-y
        `}
    >
      <InfoCard type="category" frontmatter={mainInfo.frontmatter} />

      {/* Sub-Category List */}
      <div
        className={`
      flex flex-col items-center`}
      >
        <Link
          href={`/study-notes/${mainInfo.slug.join("/")}`}
          className="py-2 pl-1 w-full flex items-center gap-1 border-b border-gray-300"
        >
          <HomeIcon className="size-4" />
          <span className="tracking-wide text-gray-70">
            {mainInfo.title}{" "}
            <span className="text-gray-600 text-[10px]">
              ({mainInfo.count})
            </span>
          </span>
        </Link>
        <div className="w-full h-full">
          {isSubCategoryEmpty ? (
            <span className="flex w-full h-full justify-center items-center text-gray-500 text-sm">
              하위 분류 없음
            </span>
          ) : (
            <ul className="overflow-y-scroll scrollbar-minimal flex flex-col w-full h-full">
              {subCategories.map((subItem) => (
                <SubCategoryItem
                  variant={"desktop"}
                  key={subItem.slug.join("/")}
                  title={subItem.frontmatter.title}
                  noteCount={subItem.notes.length}
                  slug={subItem.slug}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Note List */}
      <div className={`flex flex-col flex-1`}>
        <div className="py-2 pl-1 w-full flex items-center gap-1 border-b border-gray-300">
          <BookOpenIcon className="size-4" />
          <span className="tracking-wide text-gray-70">노트</span>
        </div>
        <ul className="flex flex-col pb-3 overflow-y-scroll scrollbar-minimal">
          {sortedNotes.map((note, i) => (
            <PostItem
              key={note.slug.join("/")}
              variant={"desktop"}
              title={note.frontmatter.title}
              order={note.frontmatter.order}
              slug={note.slug}
              i={i}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
