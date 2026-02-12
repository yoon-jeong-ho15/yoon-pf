"use client";

import { Subject, Series } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderIcon } from "@heroicons/react/24/outline";

interface SubCategoryItemProps {
  type: "mobile" | "desktop";
  title: string;
  noteCount: number;
  slug: string[];
  onSelect?: () => void;
  isSelectedSeries?: boolean;
}

export default function SubCategoryItem({
  type,
  title,
  noteCount,
  slug,
  onSelect,
  isSelectedSeries,
}: SubCategoryItemProps) {
  const pathname = usePathname();
  const isCurrent = pathname.startsWith(`/study-notes/${slug.join("/")}`);

  if (type === "desktop") {
    const href = `/study-notes/${slug.join("/")}`;

    return (
      <li>
        <Link
          href={href}
          className={`flex items-center pl-1 text-sm
          box-border border-y border-transparent
         ${isCurrent ? "font-semibold bg-lime-200/80" : ""}
         hover:border-gray-300`}
        >
          <FolderIcon className="w-4 h-4" />
          <span className={`px-2 py-1 rounded-sm`}>{title}</span>
          <span className="text-xs text-gray-700">({noteCount})</span>
        </Link>
      </li>
    );
  }

  if (type === "mobile") {
    const isSelected = isSelectedSeries;
    return (
      <li className="">
        <div
          onClick={onSelect}
          className={`flex items-center pl-1
         ${isSelected ? "font-semibold bg-gray-300/50" : ""}
         ${isCurrent ? "font-semibold bg-lime-200/80" : ""}
        `}
        >
          <FolderIcon className="w-4 h-4" />
          <span className={`px-2 py-1 rounded-sm`}>{title}</span>
          <span className="text-xs text-gray-700">({noteCount})</span>
        </div>
      </li>
    );
  }
}
