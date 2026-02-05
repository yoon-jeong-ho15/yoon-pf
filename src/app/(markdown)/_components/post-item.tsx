"use client";

import { NoteFrontmatter } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PostItem({
  note,
  i,
}: {
  note: { frontmatter: NoteFrontmatter; slug: string[] };
  i: number;
}) {
  const pathname = usePathname();
  const isSelected = pathname.endsWith(note.slug.join("/"));

  const href = `/study-notes/${note.slug.join("/")}`;

  return (
    <li
      className={`box-border flex flex-col py-1 pl-2  min-w-0 border-y border-transparent hover:border-gray-400 ${
        isSelected
          ? "font-semibold bg-linear-to-r from-slate-500/20 to-transparent"
          : ""
      }`}
    >
      <Link href={href}>
        <div className="flex items-center overflow-ellipsis w-full">
          <span className="text-slate-700 text-sm">
            {note.frontmatter.order ? note.frontmatter.order : i + 1}.
          </span>
          <span className="truncate">{note.frontmatter.title}</span>
        </div>

        <span className="text-xs text-gray-500">{note.frontmatter.date}</span>
      </Link>
    </li>
  );
}
