import CategoryView from "./ui/category-view/view";
import { fetchCategoriesWithDetail } from "@/lib/data/blog";

export default async function Page() {
  const data = await fetchCategoriesWithDetail();
  if (!data) {
    return <div>error no data</div>;
  }
  return (
    <div id="blog-category-page" className="w-full mt-5">
      <CategoryView data={data} />
    </div>
  );
}
