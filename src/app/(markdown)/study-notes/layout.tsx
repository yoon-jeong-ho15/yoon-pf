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

        {children}

        <div className="w-3"></div>
      </div>
    </div>
  );
}
