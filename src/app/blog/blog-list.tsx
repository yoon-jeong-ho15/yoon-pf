import { fetchBlogs } from "@/lib/data";
import { Blog } from "@/lib/definitions";

export function BlogItem({ id, created_at, title, category_id }: Blog) {
  // Convert ISO string to local date/time
  const date = new Date(created_at);
  const localDateTime = date.toLocaleString();
  console.log(date);
  return (
    <tr>
      <input type="hidden" value={id}></input>
      <td className="text-sm">{localDateTime}</td>
      <td className="text-center">{title}</td>
      <td className="text-center">{category_id}</td>
    </tr>
  );
}

export default async function BlogList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const blogs = await fetchBlogs(query, currentPage);
  return (
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
  );
}
