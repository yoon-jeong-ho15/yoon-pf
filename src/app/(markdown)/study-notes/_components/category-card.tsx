"use client";

import Link from "next/link";
import { Category } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function CategoryCard({
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
  const isShallow = depth < 2;
  const [isChildrenOpen, setIsChildrenOpen] = useState(isShallow || isSelected);

  useEffect(() => {
    if (isSelected) {
      setIsChildrenOpen(true);
    }
  }, [isSelected]);

  return (
    <li className="flex flex-col border-l border-b border-gray-700 my-0.5">
      <div
        className={`flex items-center px-2 justify-between transition-colors duration-500 ${
          depth === 0
            ? "bg-linear-to-l from-gray-300 to-gray-50 text-xl rounded-r-full py-1"
            : ""
        } ${depth === 1 ? "list-disc" : ""}
        ${isSelected ? "bg-selected-gradient" : ""}`}
      >
        <Link
          href={`/study-notes/${category.slug.join("/")}`}
          className={`transition-all ${isSelected ? "font-bold pl-2" : ""}`}
        >
          <span
            className={`${depth > 0 && "pl-2"} ${
              depth > 1 && "text-gray-800"
            } `}
          >
            {category.frontmatter.title}
          </span>
          <span className="ml-2 text-sm text-gray-700">
            ({category.notes.length})
          </span>
        </Link>
        {category.subCategories.length > 0 && (
          <button
            onClick={() => setIsChildrenOpen(!isChildrenOpen)}
            className=""
          >
            <ChevronDownIcon className="size-3" />
          </button>
        )}
      </div>
      {isChildrenOpen && category.subCategories.length > 0 && (
        <ul className="ml-3 mt-2">
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
