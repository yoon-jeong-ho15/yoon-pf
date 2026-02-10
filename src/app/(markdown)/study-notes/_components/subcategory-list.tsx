import SubCategoryItem from "@/features/(markdown)/components/sub-category-item";
import { CategoryFrontmatter, Series, Subject } from "@/types";
import Link from "next/link";

export default function SubCategoryList({
  mainInfo,
  subCategories,
}: {
  mainInfo: {
    title: string;
    description: string;
    frontmatter: CategoryFrontmatter;
    slug: string[];
    count: number;
  };
  subCategories: (Subject | Series)[];
}) {
  return (
    <div className="w-1/5 xl:w-full flex flex-col xl:justify-center items-center divide-y divide-gray-500">
      <Link
        href={`/study-notes/${mainInfo.slug.join("/")}`}
        className="py-2 pl-3 w-full flex items-center gap-1 border-dashed bg-gray-200"
      >
        <span className="font-semibold">
          {mainInfo.title} ({mainInfo.count})
        </span>
      </Link>
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
    </div>
  );
}
