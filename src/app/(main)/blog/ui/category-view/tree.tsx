"use client";
import { motion } from "motion/react";
import { CategoryItem } from "./item";
import { Category } from "@/lib/definitions";

export default function CategoryTree({
  categories,
  selectedCategory,
  handleSelect,
}: {
  categories: Category[];
  selectedCategory: string;
  handleSelect: (name: string) => void;
}) {
  return (
    <motion.div
      className="
      flex flex-col
      w-4/12 
      p-2
      border border-gray-200
      "
    >
      {categories.map((category, i) => (
        <CategoryItem
          key={`c${i}`}
          category={category}
          handleSelect={handleSelect}
          selectedCategory={selectedCategory}
          level={1}
        />
      ))}
    </motion.div>
  );
}
