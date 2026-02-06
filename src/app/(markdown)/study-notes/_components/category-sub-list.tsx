import { Subject, Series } from "@/types";
import Link from "next/link";
import SubCategoryItem from "./sub-category-item";

interface CategorySubListProps {
  mainInfo: {
    title: string;
    slug: string[];
    count: number;
  };
  subCategories: (Subject | Series)[];
}

export default function CategorySubList({
  mainInfo,
  subCategories,
}: CategorySubListProps) {
  return (
    <div
      className="w-1/5 xl:w-full flex flex-col justify-center items-center 
    divide-y divide-gray-500"
    >
      <Link
        href={`/study-notes/${mainInfo.slug.join("/")}`}
        className="font-semibold py-2 w-full flex justify-center items-center gap-1 bg-gray-200 hover:underline"
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
              subCategory={subItem}
            />
          ))}
        </ul>
      ) : (
        <div className="w-full flex justify-center items-center py-2 text-sm text-gray-500 h-full">
          하위 분류 없음
        </div>
      )}
    </div>
  );
}
