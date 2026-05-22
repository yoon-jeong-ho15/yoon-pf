import PostItemCard from "@/features/(markdown)/components/postitem-card";
import { getMDTree, getAllPostFromTree } from "@/features/(markdown)/lib/data";

export default function Page() {
  const tree = getMDTree("blogs");
  const blogs = getAllPostFromTree(tree).sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  );

  return (
    <div className="flex-1 flex flex-col items-start min-h-screen p-4">
      <div className="bg-surface border border-gray-500 w-full p-2">
        <h1 className="w-fit border-b border-gray-500">Recent Post</h1>
        <div className="grid grid-cols-5 p-4 gap-4">
          {blogs.map((blog) => (
            <PostItemCard key={blog.slug.join("/")} item={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
