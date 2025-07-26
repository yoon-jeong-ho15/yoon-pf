import BlogList from "./blog-list";
// import CategoryView from "./category-view";
import Search from "./ui/search";
import Write from "./ui/write";
// import { fetchCategoriesWithDetail } from "@/lib/data/blog";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  // const catgoriesWithDetail = await fetchCategoriesWithDetail();s

  return (
    <div className="flex flex-col">
      <div className="m-3">
        {/* <CategoryView categories={catgoriesWithDetail} /> */}
      </div>
      <div className="flex flex-col bg-amber-50">
        <div className="flex flex-row">
          <Search />
          <Write />
        </div>
        <div>
          <BlogList query={query} currentPage={currentPage} />
        </div>
      </div>
    </div>
  );
}
