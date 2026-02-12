"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubjectItem({
  type,
  title,
  slug,
  totalNotesCount,
  onSelect,
  isSelectedSubject,
}: {
  type?: "mobile" | "desktop";
  title: string;
  slug: string[];
  totalNotesCount: number;
  onSelect?: () => void;
  isSelectedSubject?: boolean;
}) {
  const pathname = usePathname();
  if (type === "desktop") {
    const isCurrent = pathname.startsWith(`/study-notes/${slug.join("/")}`);

    return (
      <li>
        <Link
          href={`/study-notes/${slug.join("/")}`}
          className={`flex items-center px-2 py-2 gap-2 box-border border-y border-transparent 
          hover:border-gray-300 truncate
          ${isCurrent ? "font-bold bg-green-300/50" : ""}
        `}
        >
          <span>{title}</span>
          <span className="text-sm text-gray-600 ">({totalNotesCount})</span>
        </Link>
      </li>
    );
  }

  if (type === "mobile") {
    const isCurrent = pathname.startsWith(`/study-notes/${slug.join("/")}`);
    const isSelected = isSelectedSubject;
    return (
      <li className="">
        <div
          onClick={onSelect}
          className={`flex items-center px-2 py-2 gap-2 box-border border-x border-transparent 
          hover:border-gray-300 truncate
          ${isSelected ? "font-bold bg-gray-300/50" : ""}
          ${isCurrent ? "font-bold bg-green-400/70" : ""}
        `}
        >
          <span>{title}</span>
          <span className="text-sm text-gray-600 ">({totalNotesCount})</span>
        </div>
      </li>
    );
  }
}
