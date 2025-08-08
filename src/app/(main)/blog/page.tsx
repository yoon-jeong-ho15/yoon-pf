import { getCategoryTree } from "@/lib/data/blog";
import CategoryView from "./ui/category-view/view";

export default function Page() {
  const { categories, categoryMap } = getCategoryTree();
  return (
    <div id="blog-category-page" className="w-full my-2 md:my-5">
      <CategoryView categories={categories} categoryMap={categoryMap} />
    </div>
  );
}
