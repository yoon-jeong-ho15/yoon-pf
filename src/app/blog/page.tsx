import BlogList from "./blog-list";
import Category from "./category";
import Search from "./ui/search";
import Write from "./ui/write";
import { fetchCategories } from "@/lib/actions";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const categories = await fetchCategories();

  return (
    <div className="flex flex-row">
      <div>
        <Category categories={categories} />
      </div>
      <div className="flex flex-col">
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
