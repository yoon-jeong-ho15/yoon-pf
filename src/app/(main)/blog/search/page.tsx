import { BlogItem } from "./blog-item";
import { getSortedBlogData } from "@/lib/data/blog";
import Search from "./ui/search";
import Pagination from "./ui/pagination";

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const { blogs, totalBlogs, totalPages } = getSortedBlogData(
    query,
    currentPage
  );

  return (
    <div
      id="blog-search-page"
      className="flex flex-col items-center w-full mt-5"
    >
      <div className="flex flex-row">
        <Search />
        <span className="hidden">{totalBlogs}</span>
      </div>
      <div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 ">작성일</th>
              <th className="px-4 py-3 ">제목</th>
              <th className="px-4 py-3 ">분류</th>
            </tr>
          </thead>
          <tbody>
            {blogs?.map((blog) => (
              <BlogItem key={blog.id} {...blog} />
            ))}
          </tbody>
        </table>
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
