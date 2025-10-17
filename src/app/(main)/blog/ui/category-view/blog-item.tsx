import { Blog } from "@/lib/definitions";
import Link from "next/link";
import Keyword from "./keyword";

export default function BlogItem({ blog }: { blog: Blog }) {
  return (
    <div className="my-1 py-1 bg-gray-100 flex">
      <div className="w-3/12 overflow-hidden text-slide-container">
        <Link
          href={`blog/${blog.id}`}
          className="flex whitespace-nowrap 
                nowrap animate-text-slide"
        >
          {(blog.index ? blog.index + ". " : "") + blog.title}
        </Link>
      </div>
      <div>
        {blog.tags && blog.tags.length > 0 ? (
          blog.tags.map((tag, i) => <Keyword key={i} keyword={tag} />)
        ) : (
          <span
            className="
                  p-1 rounded-lg border mr-2
                  border-gray-400
                  text-gray-400 italic
                  text-xs"
          >
            키워드 없음
          </span>
        )}
      </div>
    </div>
  );
}
