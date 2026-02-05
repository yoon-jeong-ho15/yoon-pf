import CategoryCard from "./_components/category-card";
import CategoryDetail from "./_components/category-detail";

import { getCategoryTree } from "./_lib/data";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getCategoryTree();

  return (
    <div id="study-notes-layout" className="bg-note-gradient flex-1">
      <div className="flex divide-x divide-gray-500 border-y border-gray-500 mt-4 mb-16">
        <div className="w-3"></div>
        <ul
          className="flex flex-col 
          divide-y divide-gray-500
          w-1/7 min-w-48"
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.slug.join("/")}
              category={category}
              depth={0}
            />
          ))}
        </ul>

        <div
          id=""
          className="flex-1 flex flex-col divide-y divide-gray-500 
          xl:flex-row xl:divide-x"
        >
          <div
            className={`flex min-w-64 mb-6 bg-white/30
              h-86 divide-x xl:divide-x-0 xl:divide-y divide-gray-400
              xl:h-full xl:flex-col xl:bg-transparent xl:w-1/5
              `}
          >
            <CategoryDetail categories={categories} />
          </div>
          {children}
        </div>
        <div className="w-3"></div>
      </div>
    </div>
  );
}
