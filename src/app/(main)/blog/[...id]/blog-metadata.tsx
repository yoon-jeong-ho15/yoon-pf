import { Blog } from "@/lib/definitions";
import { LinkIcon } from "@heroicons/react/24/outline";
import Back from "./back-button";

export default function BlogMetaData({ blog }: { blog: Blog }) {
  return (
    <div
      className={`flex border rounded-3xl border-gray-500 px-2 py-4 mt-5 shadow-lg`}
    >
      <Back />
      <div className="flex flex-col">
        <div className="flex text-xl md:text-4xl md:font-bold">
          <h1>{blog.title}</h1>
        </div>

        <div className="flex items-center p-1 space-x-2">
          <span className="text-gray-500">작성일 : </span>
          <span>{new Date(blog.date).toLocaleDateString()}</span>
        </div>

        {blog.instructor && (
          <div className="flex items-center p-1 space-x-2">
            <span className="text-gray-500">강의자 : </span>
            <span>{blog.instructor}</span>
          </div>
        )}
        {blog.author && (
          <div className="flex items-center p-1 space-x-2">
            <span className="text-gray-500">저자 : </span>
            <span>{blog.author}</span>
          </div>
        )}
        <div className="flex items-center p-1 space-x-2">
          {blog.provide && (
            <>
              <span className="text-gray-500">제공 : </span>
              <span>{blog.provide}</span>
            </>
          )}
          {blog.publish && (
            <>
              <span className="text-gray-500">출판사 : </span>
              <span>{blog.publish}</span>
            </>
          )}
          {blog.link && (
            <a href={blog.link}>
              <LinkIcon className="size-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
