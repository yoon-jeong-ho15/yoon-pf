"use client";

import { CategoryWithDetail } from "@/lib/definitions";
import { motion } from "motion/react";
import { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function CategoryItem({
  category,
  selectedCategory,
  handleSelect,
}: {
  category: CategoryWithDetail;
  selectedCategory: number | null;
  handleSelect: (id: number | null) => void;
}) {
  const [showChildren, setShowChildren] = useState(category.level === 1);
  const hasChildren = category.children && category.children.length > 0;

  const handleToggleChildren = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setShowChildren(!showChildren);
    }
  };

  const handleItemClick = () => {
    if (selectedCategory !== category.id) {
      handleSelect(category.id);
    } else {
      handleSelect(null);
    }
  };

  return (
    <motion.div className="flex flex-col text-sm">
      <motion.div
        onClick={handleItemClick}
        className={`
          flex items-center r
          ounded-md 
          hover:bg-gray-200 
          dark:hover:bg-gray-700
          cursor-pointer ${
            selectedCategory === category.id
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }`}
        style={{ paddingLeft: `${category.level * 12}px` }}
      >
        {hasChildren ? (
          <motion.div
            onClick={handleToggleChildren}
            className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
            animate={{ rotate: showChildren ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRightIcon />
          </motion.div>
        ) : (
          <div className="w-6" />
        )}
        <span className="flex-grow px-2 py-1">{category.name}</span>
        <span className="px-2 text-gray-500 dark:text-gray-400">
          ({category.count})
        </span>
      </motion.div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: showChildren ? "auto" : 0,
          opacity: showChildren ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        {showChildren &&
          category.children?.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              handleSelect={handleSelect}
              selectedCategory={selectedCategory}
            />
          ))}
      </motion.div>
    </motion.div>
  );
}
