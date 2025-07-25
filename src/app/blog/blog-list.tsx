import { fetchBlogs } from "@/lib/data";
import { Blog } from "@/lib/definitions";
import Link from "next/link";

export function BlogItem({ id, created_at, title, category_id }: Blog) {
  const date = new Date(created_at);
  const localDateTime = date.toLocaleString();

  return (
    <tr>
      <td className="hidden">{id}</td>
      <td className="text-sm">{localDateTime}</td>
      <td className="text-center">
        <Link href={`/blog/${id}`} className="hover:text-blue-600">
          {title}
        </Link>
      </td>
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
