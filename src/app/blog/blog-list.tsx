import { fetchBlogs } from "@/lib/data";

export default function BlogList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const blogs = fetchBlogs(query, currentPage);
  return (
    <div>
      <div>
        <h1>blog list</h1>
      </div>
      <div>{blogs}</div>
    </div>
  );
}
