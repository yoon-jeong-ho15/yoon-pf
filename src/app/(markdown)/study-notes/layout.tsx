import CategoryCard from "./_components/category-card";
import { getCategoryTree } from "./_lib/data";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getCategoryTree();
  return (
    <div className="flex gap-4 flex-1 bg-note-gradient">
      <ul className="flex flex-col w-1/6 mt-10 ml-4 pb-20">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug.join("/")}
            category={category}
            depth={0}
          />
        ))}
      </ul>
      <div className="w-5/6 min-h-full flex pb-30 pt-10">{children}</div>
    </div>
  );
}
