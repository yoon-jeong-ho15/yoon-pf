"use client";
import { CategoryWithDetail, CategoryWithDetailMap } from "@/lib/definitions";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function BlogList({
  categoryMap,
  selectedCategory,
}: {
  categoryMap: CategoryWithDetailMap | null;
  selectedCategory: number | null;
}) {
  const [category, setCategory] = useState<CategoryWithDetail | null>(null);

  useEffect(() => {
    if (!selectedCategory || !categoryMap) {
      return;
    }
    const newCategory = categoryMap.get(selectedCategory)!;
    setCategory(newCategory);
  }, [categoryMap, selectedCategory]);

  return (
    <motion.div>
      <motion.div>{category?.name}</motion.div>
      {category?.blogs?.map((blog) => (
        <motion.div key={`b${blog.id}`}>{blog.title}</motion.div>
      ))}
    </motion.div>
  );
}
