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
    <motion.table id="blog-list" className="w-full">
      <thead>
        <tr>
          <th className="px-4 py-3 ">제목</th>
          <th className="px-4 py-3 ">키워드</th>
        </tr>
      </thead>
      <tbody>
        {category?.blogs?.map((blog) => (
          <tr key={`b${blog.id}`}>
            <td>{blog.title}</td>
            <td>{blog.keyword}</td>
          </tr>
        ))}
      </tbody>
    </motion.table>
  );
}
