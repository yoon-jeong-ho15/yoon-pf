"use client";
import { Category, CategoryMap } from "@/lib/definitions";
import { useState } from "react";
import BlogList from "./blog-list";
import CategoryTree from "./tree";

export default function CategoryView({
  categories,
  categoryMap,
}: {
  categories: Category[];
  categoryMap: CategoryMap;
}) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSelect = (name: string) => {
    setSelectedCategory(name);
  };

  return (
    <div className="flex justify-around">
      <CategoryTree
        categories={categories}
        selectedCategory={selectedCategory}
        handleSelect={handleSelect}
      />
      <BlogList categoryMap={categoryMap} selectedCategory={selectedCategory} />
    </div>
  );
}
