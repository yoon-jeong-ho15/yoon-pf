"use client";

import Link from "next/link";
import { Category } from "@/types";
import { usePathname } from "next/navigation";

export default function CategoryTree({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="flex flex-col w-1/6">
      {categories.map((category) => (
        <CategoryCard
          key={category.slug.join("/")}
          category={category}
          depth={0}
        />
      ))}
    </div>
  );
}

export function CategoryCard({
  category,
  depth,
}: {
  category: Category;
  depth: number;
}) {
  const pathname = usePathname();
  const isSelected = pathname.startsWith(
    `/study-notes/${category.slug.join("/")}`
  );

  return (
    <div className="flex flex-col border rounded my-0.5">
      <div
        className={`flex justify-between items-center ${
          isSelected ? "bg-amber-200" : ""
        }`}
      >
        <Link
          href={`/study-notes/${category.slug.join("/")}`}
          className={`${isSelected ? "font-bold" : ""}`}
        >
          {category.frontmatter.title}
        </Link>
      </div>
      <div className="ml-4 mt-2">
        {category.subCategories.map((subCategory) => (
          <CategoryCard
            key={subCategory.slug.join("/")}
            category={subCategory}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  );
}
