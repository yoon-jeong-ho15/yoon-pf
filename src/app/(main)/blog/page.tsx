import CategoryView from "./category-view";
import { fetchCategoriesWithDetail } from "@/lib/data/blog";

export default async function Page() {
  const categories = await fetchCategoriesWithDetail();
  return (
    <div className="flex flex-col">
      <div className="m-3">
        <CategoryView categories={categories} />
      </div>
    </div>
  );
}
