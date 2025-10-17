"use client";
import { CategoryItem } from "./category-item";
import { Category } from "@/lib/definitions";

export default function CategoryTree({
  categories,
  selectedCategory,
}: {
  categories: Category[];
  selectedCategory: string;
}) {
  return (
    <div className="hidden md:flex flex-col w-3/12 px-3">
      {categories.map((category, i) => (
        <CategoryItem
          key={`c${i}`}
          category={category}
          selectedCategory={selectedCategory}
          level={1}
        />
      ))}
    </div>
  );
}
