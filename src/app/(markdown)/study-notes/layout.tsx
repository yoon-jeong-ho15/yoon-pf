import CategoryCard from "./_components/category-card";
import { getCategoryTree } from "./_lib/data";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getCategoryTree();
  return (
    <div id="study-notes-layout" className="flex gap-4 bg-note-gradient">
      <ul className="flex flex-col w-1/6 mt-10 ml-4 pb-20 min-w-64">
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
        className="flex-1 min-w-0 min-h-full 
        flex flex-col 
        xl:grid xl:grid-cols-4 
        pb-30 pt-10 gap-4"
      >
        {children}
      </div>
    </div>
  );
}
