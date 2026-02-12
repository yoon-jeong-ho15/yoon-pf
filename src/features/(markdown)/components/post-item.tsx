"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

export default function PostItem({
  type,
  title,
  order,
  slug,
  i,
  onSelect,
}: {
  type: "mobile" | "desktop";
  title: string;
  order?: number;
  slug: string[];
  i: number;
  onSelect?: () => void;
}) {
  const pathname = usePathname();
  const isSelected = pathname.endsWith(slug.join("/"));
  const href = `/study-notes/${slug.join("/")}`;

  if (type === "desktop") {
    return (
      <li>
        <Link
          href={href}
          className={`flex py-2 pl-2 items-center gap-1 box-border border-y border-transparent 
          hover:border-gray-300 text-sm ${
            isSelected ? "font-semibold bg-blue-400/60" : ""
          }`}
        >
          <span className="text-slate-700">{order ? order : i + 1}.</span>
          <span className="truncate">{title}</span>
        </Link>
      </li>
    );
  }

  if (type === "mobile") {
    return (
      <li className="flex overflow-x-scroll" style={{ scrollbarWidth: "none" }}>
        <Link
          href={href}
          onClick={onSelect}
          className={`flex py-2 px-2 pr-6 items-center gap-1
          ${isSelected ? "font-semibold bg-blue-400/60" : ""}`}
        >
          <span className="text-slate-700">{order ? order : i + 1}.</span>
          <span className="whitespace-nowrap">{title}</span>
        </Link>
      </li>
    );
  }
}
