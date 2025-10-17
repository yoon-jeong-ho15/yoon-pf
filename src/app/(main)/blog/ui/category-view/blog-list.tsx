import { Category } from "@/lib/definitions";
import BlogItem from "./blog-item";

export default function BlogList({ category }: { category: Category | null }) {
  return (
    <div className="w-full border border-gray-200 p-2 flex flex-col rounded-2xl">
      <div className="text-4xl m-1 mb-8 flex">
        <span>{category?.name || ""}</span>
      </div>

      {category && (
        <div className="">
          {category.blogs.map((blog, i) => (
            <BlogItem key={`b${i}`} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
