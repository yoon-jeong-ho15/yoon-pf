"use client";

import { Category } from "@/lib/definitions";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
// import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";

export function CategoryItem({
  category,
  selectedCategory,
  handleSelect,
  level,
}: {
  category: Category;
  selectedCategory: string;
  handleSelect: (name: string) => void;
  level: number;
}) {
  const [showChildren, setShowChildren] = useState(level < 3);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategory === category.path.join("/");

  const handleClick = () => {
    if (hasChildren) {
      setShowChildren(!showChildren);
    }
    if (!isSelected) {
      handleSelect(category.path.join("/"));
    } else {
      handleSelect("");
    }
  };

  return (
    <motion.div
      className={`
        flex flex-col mx-1
        border border-gray-300
        py-1 rounded-xl my-1
        `}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <motion.div
        onClick={handleClick}
        className={`
          flex items-center justify-between
          rounded-xl
          hover:pl-3 transition-all
          cursor-pointer ${isSelected ? "bg-gray-200 dark:bg-gray-700" : ""}
          py-1 
          `}
      >
        <div className="pl-1">{category.name}</div>
        <div className="hidden">{category.path.join(" > ")}</div>
        {/* <button
          className="
        flex md:hidden
        bg-gray-100
        mr-2"
        >
          <Bars3BottomLeftIcon className="size-6" />
        </button> */}
      </motion.div>
      {showChildren &&
        category.children?.map((child) => (
          <CategoryItem
            key={`c${child.name}`}
            category={child}
            handleSelect={handleSelect}
            selectedCategory={selectedCategory}
            level={level + 1}
          />
        ))}
    </motion.div>
  );
}

export function MobileCategoryItem({
  category,
  level,
}: {
  category: Category;
  level: number;
}) {
  const [showBlogs, setShowBlogs] = useState(false);

  return (
    <motion.div
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
        <motion.div
          className="border-t mb-3 border-zinc-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {category.blogs.map((blog, k) => (
            <div key={k} className="pl-2 my-2">
              <Link
                className="text-sm text-gray-600 border-b"
                href={`blog/${blog.id}`}
              >
                {blog.title}
              </Link>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
