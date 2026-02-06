import { Domain, Subject, NoteFrontmatter, Series } from "@/types";
import Frontmatter from "../../_components/frontmatter";
import PostItem from "../../_components/post-item";
import { sortFrontmatter } from "../_lib/util";
import { LinkMetadata } from "@/lib/metadata";
import SubCategoryItem from "./sub-category-item";
import Link from "next/link";

interface CategoryDetailProps {
  category: Domain | Subject | Series;
  notes?: { frontmatter: NoteFrontmatter; slug: string[] }[];
  metadataMap?: Record<string, LinkMetadata>;
}

export default function CategoryDetail({
  category,
  notes,
  metadataMap,
}: CategoryDetailProps) {
  if (!category) {
    return null;
  }

  const targetNotes = notes || category.notes;
  const sortedNotes = [...targetNotes].sort((a, b) => {
    return (a.frontmatter.order || 0) - (b.frontmatter.order || 0);
  });

  const descriptionHtml = category.description
    ? `<p>${category.description}</p>`
    : "";

  let subItems: any[] = [];
  if ("subjects" in category) {
    subItems = category.subjects;
  } else if ("series" in category) {
    subItems = category.series;
  }

  return (
    <>
      {/* Category frontmatter */}
      <div className="flex-1 xl:flex-none text-sm divide-y divide-gray-300">
        <div className="p-4 bg-gradient-to-l from-violet-400 to-indigo-100 h-36 xl:h-46">
          {sortFrontmatter(category.frontmatter).map(([key, value]) => (
            <Frontmatter
              key={key}
              type="category"
              label={key}
              value={value}
              metadataMap={metadataMap}
            />
          ))}
        </div>

        <div
          className="p-4 h-28 overflow-auto scrollbar-minimal"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      </div>

      {/* Series list */}
      <div
        className="w-1/5 xl:w-full flex flex-col justify-center items-center 
      divide-y divide-gray-500"
      >
        <Link
          href={`/study-notes/${category.slug.join("/")}`}
          className="font-semibold py-2 w-full flex justify-center items-center gap-1 bg-gray-200"
        >
          <span>{category.frontmatter.title}</span>
          <span className="text-xs text-gray-700">
            ({category.notes.length})
          </span>
        </Link>

        {subItems.length > 0 ? (
          <ul className="overflow-y-scroll scrollbar-minimal flex flex-col w-full">
            {subItems.map((subItem) => (
              <SubCategoryItem
                key={subItem.slug.join("/")}
                subCategory={subItem}
              />
            ))}
          </ul>
        ) : (
          <div className="w-full flex justify-center items-center py-2 text-sm text-gray-500">
            하위 분류 없음
          </div>
        )}
      </div>

      {/* Notes list */}
      <ul
        className="w-1/3 xl:w-full flex flex-col 
      overflow-y-scroll scrollbar-minimal 
      bg-white/30"
      >
        {sortedNotes.map((note, i) => (
          <PostItem key={note.slug.join("/")} note={note} i={i} />
        ))}
      </ul>
    </>
  );
}
