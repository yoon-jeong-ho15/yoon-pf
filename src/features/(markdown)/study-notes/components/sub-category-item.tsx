"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderIcon } from "@heroicons/react/24/outline";

interface SubCategoryItemProps {
  variant: "mobile" | "desktop";
  title: string;
  slug: string[];
  onSelect?: () => void;
  isSelectedSeries?: boolean;
}

export default function SubCategoryItem({
  variant,
  title,
  slug,
  onSelect,
  isSelectedSeries,
}: SubCategoryItemProps) {
  const pathname = usePathname();
  const isCurrent = pathname.startsWith(`/study-notes/${slug.join("/")}`);

  if (variant === "desktop") {
    const href = `/study-notes/${slug.join("/")}`;

    return (
      <Link href={href} className={` `}>
        <span
          className={`text-orange-800 hover:bg-zinc-100 ${
            isCurrent
              ? "bg-zinc-200 underline decoration-red-500 decoration-dotted decoration-2"
              : ""
          }`}
        >{`"${title}"`}</span>
      </Link>
    );
  }

  if (variant === "mobile") {
    const isSelected = isSelectedSeries;
    return (
      <li className="">
        <div
          onClick={onSelect}
          className={`flex items-center pl-1
         ${isSelected ? "bg-gray-200" : ""}
         ${isCurrent ? "bg-lime-200" : ""}
        `}
        >
          <FolderIcon className="w-4 h-4" />
          <span className={`px-2 py-1 rounded-sm`}>{title}</span>
        </div>
      </li>
    );
  }
}
