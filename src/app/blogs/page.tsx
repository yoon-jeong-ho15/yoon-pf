import PostItemCard from "@/components/(markdown)/postitem-card";
import { getMDTree } from "@/lib/markdown-tree";
import { getAllPostFromTree } from "@/lib/posts";

export default async function Page() {
  const tree = await getMDTree("blogs");
  const blogs = getAllPostFromTree(tree).sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  );

  return (
    <div className="flex-1 flex flex-col items-start min-h-screen p-4">
      <div className="bg-surface border border-default w-full p-2">
        <h1 className="w-fit border-b border-default">Recent Post</h1>
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 p-4 gap-4">
          {blogs.map((blog) => (
            <PostItemCard
              key={blog.slug.join("/")}
              item={blog}
              href={`/blogs/${blog.slug.join("/")}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
