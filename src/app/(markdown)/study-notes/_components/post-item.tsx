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
    <li>
      <Link
        href={href}
        className={`flex py-2 pl-2 box-border border-y border-transparent 
          hover:border-gray-300 ${
            isSelected
              ? "font-semibold bg-linear-to-r from-lime-400/60 to-transparent"
              : ""
          }`}
      >
        <span className="text-slate-700 text-sm">
          {note.frontmatter.order ? note.frontmatter.order : i + 1}.
        </span>
        <span className="truncate">{note.frontmatter.title}</span>
      </Link>
    </li>
  );
}
