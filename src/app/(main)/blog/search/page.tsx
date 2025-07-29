import { fetchBlogs } from "@/lib/data/blog";
import Search from "./search";
import Write from "../ui/write";
import { BlogItem } from "./blog-item";

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const blogs = await fetchBlogs(query, currentPage);
  return (
    <div className="flex flex-col bg-amber-50">
      <div className="flex flex-row">
        <Search />
        <Write />
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th className="px-4 py-3 w-50">작성일</th>
              <th className="px-4 py-3 w-1/2">제목</th>
              <th className="px-4 py-3 ">분류</th>
            </tr>
          </thead>
          <tbody>
            {blogs?.map((item) => (
              <BlogItem key={item.id} {...item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
