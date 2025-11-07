"use client";

import { Category } from "@/lib/definitions";
import Link from "next/link";
import { useState } from "react";

export function MobileCategoryItem({
  category,
  level,
}: {
  category: Category;
  level: number;
}) {
  const [showBlogs, setShowBlogs] = useState(false);

  return (
    <div
      style={{ paddingLeft: level * 2 }}
      className="mt-1 border rounded border-y-gray-200 border-x-gray-100"
    >
      <div
        onClick={() => {
          if (category.blogs.length > 0) {
            setShowBlogs(!showBlogs);
          }
        }}
        className="flex items-center text-lg"
      >
        <span className="py-2">{category.name}</span>
        {showBlogs ? (
          <span className="ml-1 text-xs text-blue-700">접기</span>
        ) : (
          <span className="ml-1 rounded text-xs text-blue-700">
            {category.blogs.length > 0 ? `(${category.blogs.length})` : ""}
          </span>
        )}
      </div>
      {category.children &&
        category.children.length > 0 &&
        category.children.map((child, j) => (
          <MobileCategoryItem key={j} category={child} level={level + 1} />
        ))}
      {showBlogs && (
        <div className="border-t mb-3 border-zinc-200">
          {category.blogs.map((blog, k) => (
            <div key={k} className="pl-2 my-2">
              <Link
                className="text-sm text-gray-600 border-b"
                href={`/blog/${blog.id}`}
              >
                {blog.title}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
