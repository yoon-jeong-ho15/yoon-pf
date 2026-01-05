import CategoryTree from "./_components/category-tree";
import { getCategoryTree } from "./data";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getCategoryTree();
  return (
    <div className="flex">
      <CategoryTree categories={categories} />
      {children}
    </div>
  );
}
