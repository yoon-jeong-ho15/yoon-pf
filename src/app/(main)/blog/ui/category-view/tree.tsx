"use client";

import { CategoryWithDetail } from "@/lib/definitions";
import { motion } from "motion/react";
import CategoryItem from "./item";

export default function CategoryTree({
  categories,
  selectedCategory,
  handleSelect,
}: {
  categories: CategoryWithDetail[];
  selectedCategory: number | null;
  handleSelect: (id: number | null) => void;
}) {
  return (
    <motion.div
      className="
      flex flex-col
      w-4/12 
      p-2
      "
    >
      {categories.map((category) => (
        <CategoryItem
          key={`c${category.id}`}
          category={category}
          handleSelect={handleSelect}
          selectedCategory={selectedCategory}
        />
      ))}
    </motion.div>
  );
}
