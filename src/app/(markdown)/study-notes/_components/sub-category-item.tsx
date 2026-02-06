"use client";

import { Subject, Series } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderIcon } from "@heroicons/react/24/outline";

interface SubCategoryItemProps {
  subCategory: Subject | Series;
}

export default function SubCategoryItem({ subCategory }: SubCategoryItemProps) {
  const pathname = usePathname();
  const href = `/study-notes/${subCategory.slug.join("/")}`;
  const isSelected = pathname.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center pl-1 
         ${isSelected ? "font-bold bg-gradient-to-r from-violet-400/50 to-transparent" : ""}`}
      >
        <FolderIcon className="w-4 h-4" />
        <span className={`hover:font-semibold px-2 py-1 rounded-sm `}>
          {subCategory.frontmatter.title}
        </span>
        <span className="text-xs text-gray-700">
          ({subCategory.notes.length})
        </span>
      </Link>
    </li>
  );
}
