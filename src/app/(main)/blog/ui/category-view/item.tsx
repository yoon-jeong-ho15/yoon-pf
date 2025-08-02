"use client";

import { CategoryWithDetail } from "@/lib/definitions";
import { motion } from "motion/react";
import { useState } from "react";

export default function CategoryItem({
  category,
  selectedCategory,
  handleSelect,
}: {
  category: CategoryWithDetail;
  selectedCategory: number | null;
  handleSelect: (id: number | null) => void;
}) {
  const [showChildren, setShowChildren] = useState(category.level < 3);
  const hasChildren = category.children && category.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setShowChildren(!showChildren);
    }
    if (selectedCategory !== category.id) {
      handleSelect(category.id);
    } else {
      handleSelect(null);
    }
  };

  return (
    <motion.div
      className={`
        flex flex-col mx-1
        border border-gray-300
        p-1 rounded-xl my-1
        `}
    >
      <motion.div
        onClick={handleClick}
        className={`
          flex items-center 
          rounded-xl p-1
          hover:pl-3 transition-all
          cursor-pointer ${
            selectedCategory === category.id
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
          py-1
          `}
      >
        <div>{category.name}</div>
      </motion.div>
      {showChildren &&
        category.children?.map((child) => (
          <CategoryItem
            key={`c${child.name}`}
            category={child}
            handleSelect={handleSelect}
            selectedCategory={selectedCategory}
          />
        ))}
    </motion.div>
  );
}
