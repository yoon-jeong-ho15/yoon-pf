"use client";

import { Category } from "@/lib/definitions";
import Link from "next/link";
import { useState } from "react";

export function CategoryItem({
  category,
  selectedCategory,
  level,
}: {
  category: Category;
  selectedCategory: string;
  level: number;
}) {
  const [showChildren, setShowChildren] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategory === category.path.join("/");
  const categoryPath = category.path.join("/");

  return (
    <div
      className={`level-${level} flex flex-col mx-1 border border-gray-300 py-1 rounded-xl my-1 ${
        level > 1 ? "ml-4" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <Link
          href={isSelected ? "/blog/categories" : `/blog/categories?category=${categoryPath}`}
          className={`
            flex-1
            rounded-xl
            hover:pl-4 transition-all
            cursor-pointer
            py-1 pl-3
            `}
        >
          <span className={`${isSelected ? "underline" : ""}`}>
            {category.name}
          </span>
          <span className="ml-1 rounded text-xs text-gray-700">
            {category.blogs.length > 0 ? `(${category.blogs.length})` : ""}
          </span>
        </Link>

        {hasChildren && (
          <button
            onClick={() => setShowChildren(!showChildren)}
            className="px-2 text-gray-500 hover:text-gray-700"
          >
            {showChildren ? "−" : "+"}
          </button>
        )}
      </div>
      {showChildren &&
        category.children?.map((child) => (
          <CategoryItem
            key={`c${child.name}`}
            category={child}
            selectedCategory={selectedCategory}
            level={level + 1}
          />
        ))}
    </div>
  );
}
