"use client";

import { Subject, Series } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderIcon } from "@heroicons/react/24/outline";

interface SubCategoryItemProps {
  title: string;
  noteCount: number;
  slug: string[];
}

export default function SubCategoryItem({
  title,
  noteCount,
  slug,
}: SubCategoryItemProps) {
  const pathname = usePathname();
  const href = `/study-notes/${slug.join("/")}`;
  const isSelected = pathname.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center pl-1 text-sm text-gray-800
          box-border border-y border-transparent
         ${isSelected ? "font-semibold bg-linear-to-r from-slate-200 to-slate-50" : ""}
         hover:border-gray-300`}
      >
        <FolderIcon className="w-4 h-4" />
        <span className={`px-2 py-1 rounded-sm`}>{title}</span>
        <span className="text-xs text-gray-700">({noteCount})</span>
      </Link>
    </li>
  );
}
