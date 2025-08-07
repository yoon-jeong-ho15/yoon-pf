"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Keyword from "./keyword";
import Link from "next/link";
import { Category, CategoryMap } from "@/lib/definitions";

export default function BlogList({
  categoryMap,
  selectedCategory,
}: {
  categoryMap: CategoryMap | null;
  selectedCategory: string;
}) {
  const [category, setCategory] = useState<Category | null>(null);
  // console.log(categoryMap);

  useEffect(() => {
    if (!selectedCategory || !categoryMap) {
      return;
    }
    console.log(selectedCategory);
    const newCategory = categoryMap[selectedCategory]!;
    console.log(newCategory);
    setCategory(newCategory);
  }, [categoryMap, selectedCategory]);

  return (
    <motion.div id="blog-list" className="w-full border border-gray-200 p-2">
      <div className="text-lg">{category?.name}</div>
      {category?.blogs.map((blog, i) => (
        <div
          key={`b${i}`}
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
      ))}
    </motion.div>
  );
}
