"use client";

import Link from "next/link";
import { Domain } from "@/types";
import { usePathname } from "next/navigation";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function DomainItem({
  title,
  slug,
  children,
}: {
  title: string;
  slug: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Check if exactly this domain or one of its subjects/series is selected.
  // Actually, standard logic is just startsWith current domain prefix.
  // If we want exact match only for direct click, well, usually navigation highlights parent too.
  // The user asked "SubjectItem처럼" (like SubjectItem).
  // SubjectItem uses: pathname.startsWith(`/study-notes/${subject.slug.join("/")}`)
  // So we will do the same.

  const isSelected = pathname.startsWith(`/study-notes/${slug.join("/")}`);

  return (
    <li>
      <Link
        href={`/study-notes/${slug.join("/")}`}
        className={`flex justify-center items-center gap-3 border-b py-2 border-gray-400
        ${isSelected ? "bg-selected-gradient text-black" : "bg-gray-200"}
      `}
      >
        <span className="font-bold text-xl">{title}</span>
      </Link>
      {children}
    </li>
  );
}
