"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PostItem({
  title,
  order,
  slug,
  i,
}: {
  title: string;
  order?: number;
  slug: string[];
  i: number;
}) {
  const pathname = usePathname();
  const isSelected = pathname.endsWith(slug.join("/"));
  const href = `/study-notes/${slug.join("/")}`;

  return (
    <li>
      <Link
        href={href}
        className={`flex py-2 pl-2 items-center gap-1 box-border border-y border-transparent 
          hover:border-gray-300 text-sm ${
            isSelected
              ? "font-semibold bg-linear-to-r from-slate-200 to-slate-50"
              : ""
          }`}
      >
        <span className="text-slate-700">{order ? order : i + 1}.</span>
        <span className="truncate">{title}</span>
      </Link>
    </li>
  );
}
