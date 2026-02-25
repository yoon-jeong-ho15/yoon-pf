import { CategoryFrontmatter } from "@/types";

import FrontmatterList from "@/features/(markdown)/components/frontmatter-list";

interface CategoryInfoProps {
  type: "mobile" | "desktop";
  mainInfo: {
    title: string;
    description: string;
    frontmatter: CategoryFrontmatter;
  };
}

export default function CategoryInfo({ type, mainInfo }: CategoryInfoProps) {
  return (
    <div
      className={`flex flex-col divide-y divide-gray-500 p-2 gap-2 
        grow-0 shrink-0 basis-64 lg:basis-74 xl:w-full xl:basis-68
    bg-linear-to-b from-green-400 to-lime-200
    `}
    >
      <h1 className={`text-2xl font-semibold text-shadow pl-3 py-1.5`}>
        {mainInfo.title}
      </h1>
      <FrontmatterList frontmatter={mainInfo.frontmatter} type="category" />
    </div>
  );
}
