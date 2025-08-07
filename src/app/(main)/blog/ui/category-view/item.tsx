"use client";

import { Category } from "@/lib/definitions";
import { motion } from "motion/react";
import { useState } from "react";

export default function CategoryItem({
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
    >
      <motion.div
        onClick={handleClick}
        className={`
          flex items-center 
          rounded-xl
          hover:pl-3 transition-all
          cursor-pointer ${isSelected ? "bg-gray-200 dark:bg-gray-700" : ""}
          py-1
          `}
      >
        <div className="pl-1">{category.name}</div>
        <div className="hidden">{category.path.join(" > ")}</div>
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
