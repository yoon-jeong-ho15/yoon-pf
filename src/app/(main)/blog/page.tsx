import { BlogItem, MobileBlogItem } from "./search/blog-item";
import { getMainBlogData } from "@/lib/data/blog";
import Search from "./search/ui/search";
import Pagination from "./search/ui/pagination";

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
      className="flex flex-col items-center w-full my-3 md:my-5 px-1"
    >
      <div className="flex flex-row mx-3">
        <Search />
        <span className="hidden">{totalBlogs}</span>
      </div>
      <div className="hidden md:flex md:flex-col w-8/12">
        <table className="">
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
      <div className="flex flex-col md:hidden items-center mt-4 mb-5 w-full">
        {blogs?.map((blog) => (
          <MobileBlogItem key={blog.id} {...blog} />
        ))}
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
