"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubjectItem({
  title,
  slug,
  totalNotesCount,
}: {
  title: string;
  slug: string[];
  totalNotesCount: number;
}) {
  const pathname = usePathname();
  const isSelected = pathname.startsWith(`/study-notes/${slug.join("/")}`);

  return (
    <li
      className={`flex items-center px-2 py-2 gap-2 
          ${isSelected ? "font-bold bg-selected-gradient" : ""}
        `}
    >
      <Link href={`/study-notes/${slug.join("/")}`} className={`truncate`}>
        {title}
      </Link>
      <span className="text-sm text-gray-600 ">({totalNotesCount})</span>
    </li>
  );
}
