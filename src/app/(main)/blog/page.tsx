import CategoryView from "./ui/category-view/view";
import { fetchCategoriesWithDetail } from "@/lib/data/blog";

export default async function Page() {
  const data = await fetchCategoriesWithDetail();
  if (!data) {
    return <div>error no data</div>;
  }
  return (
    <div className="flex flex-col flex-grow">
      <CategoryView data={data} />
    </div>
  );
}
