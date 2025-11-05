import { getMainBlogData } from "@/lib/data/blog";
import Search from "./search/ui/search";
import Pagination from "./search/ui/pagination";
import BlogCard from "./ui/main-view/blog-card";

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const { blogs, totalBlogs, totalPages } = getMainBlogData(
    query,
    currentPage
  );

  return (
    <div
      id="main-blog-page"
      className="flex flex-col items-center w-full my-3 md:my-5 px-3 md:px-6"
    >
      {/* Search Bar */}
      <div className="flex flex-row mx-3 mb-6">
        <Search />
        <span className="hidden">{totalBlogs}</span>
      </div>

      {/* Grid Layout */}
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">블로그 글이 없습니다.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
    </div>
  );
}
