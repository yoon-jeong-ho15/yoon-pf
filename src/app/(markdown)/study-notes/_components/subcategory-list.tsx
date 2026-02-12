import SubCategoryItem from "@/features/(markdown)/components/sub-category-item";
import { CategoryFrontmatter, Series, Subject } from "@/types";
import Link from "next/link";

export default function SubCategoryList({
  type,
  mainInfo,
  subCategories,
}: {
  type: "mobile" | "desktop";
  mainInfo: {
    title: string;
    description: string;
    frontmatter: CategoryFrontmatter;
    slug: string[];
    count: number;
  };
  subCategories: (Subject | Series)[];
}) {
  const isEmpty = subCategories.length === 0;

  return (
    <div
      className={`
      flex flex-col items-center divide-y divide-gray-500
      ${
        isEmpty
          ? "hidden xl:flex xl:w-full xl:basis-auto border-b border-gray-500 xl:border-b-0"
          : "w-64 xl:w-full xl:basis-54"
      }
    `}
    >
      <Link
        href={`/study-notes/${mainInfo.slug.join("/")}`}
        className="py-2 pl-3 w-full flex items-center gap-1 border-dashed bg-gray-200"
      >
        <span className="font-semibold">
          {mainInfo.title} ({mainInfo.count})
        </span>
      </Link>
      {isEmpty ? (
        <div className="w-full p-4 text-center text-gray-500 text-sm">
          하위 분류 없음
        </div>
      ) : (
        <ul className="overflow-y-scroll scrollbar-minimal flex flex-col w-full h-full">
          {subCategories.map((subItem) => (
            <SubCategoryItem
              type={type}
              key={subItem.slug.join("/")}
              title={subItem.frontmatter.title}
              noteCount={subItem.notes.length}
              slug={subItem.slug}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
