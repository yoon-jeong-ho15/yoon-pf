"use client";

import Link from "next/link";
import { Category } from "@/types";
import { usePathname } from "next/navigation";

export default function CategoryCard({
  category,
  depth,
}: {
  category: Category;
  depth: number;
}) {
  const pathname = usePathname();
  const isSelected = pathname.startsWith(
    `/study-notes/${category.slug.join("/")}`,
  );

  return (
    <li
      className={`flex flex-col
        ${depth === 1 ? "pb-2" : ""}
        `}
    >
      <div
        className={`flex items-center px-2 justify-between
          ${depth === 0 ? "py-2 justify-center border-b border-gray-500" : ""}
          ${isSelected ? "font-bold pl-3 bg-selected-gradient" : ""}
        `}
      >
        <Link
          href={`/study-notes/${category.slug.join("/")}`}
          className={`${depth < 1 ? "text-2xl" : depth < 2 ? "text-lg" : "text-md"}`}
        >
          {depth > 1 && <span>-</span>}
          <span className={`ml-1`}>{category.frontmatter.title}</span>
          <span className="ml-2 text-sm text-gray-700">
            ({category.notes.length})
          </span>
        </Link>
      </div>

      {depth < 1 && category.subCategories.length > 0 && (
        <ul className="pt-2">
          {category.subCategories.map((subCategory) => (
            <CategoryCard
              key={subCategory.slug.join("/")}
              category={subCategory}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
