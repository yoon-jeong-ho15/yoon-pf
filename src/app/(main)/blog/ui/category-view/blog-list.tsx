"use client";
import { CategoryWithDetail, CategoryWithDetailMap } from "@/lib/definitions";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Keyword from "./keyword";
import Link from "next/link";

export default function BlogList({
  categoryMap,
  selectedCategory,
}: {
  categoryMap: CategoryWithDetailMap | null;
  selectedCategory: number | null;
}) {
  const [category, setCategory] = useState<CategoryWithDetail | null>(null);
  console.log(categoryMap);

  useEffect(() => {
    if (!selectedCategory || !categoryMap) {
      return;
    }
    const newCategory = categoryMap.get(selectedCategory)!;
    setCategory(newCategory);
  }, [categoryMap, selectedCategory]);

  return (
    <motion.div id="blog-list" className="w-full border border-gray-200 p-2">
      <div className="text-lg">{category?.name}</div>
      <div>{category?.description}</div>
      {category?.blogs
        ?.sort((a, b) => (a.id as number) - (b.id as number))
        .map((blog) => (
          <div
            key={`b${blog.id}`}
            className="
          my-1 py-1 bg-gray-100
          flex
          "
          >
            <div className="w-3/12 overflow-hidden text-slide-container">
              <Link
                href={`blog/${blog.id}`}
                className="flex whitespace-nowrap 
                nowrap animate-text-slide"
              >
                {blog.title}
              </Link>
            </div>
            <div>
              {blog.keyword && blog.keyword.length > 0 ? (
                blog.keyword.map((keyword, i) => (
                  <Keyword key={i} keyword={keyword} />
                ))
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
        ))}
    </motion.div>
  );
}
