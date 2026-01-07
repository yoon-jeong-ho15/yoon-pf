"use client";

import { Note, NoteFrontmatter } from "@/types";
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
  return (
    <li
      className={`flex flex-col justify-center ${
        isSelected
          ? "font-semibold items-end pr-16 border-b border-t border-gray-700 my-0.5"
          : ""
      }`}
    >
      <Link href={`/study-notes/${note.slug.join("/")}`} className="flex gap-1">
        <span>{note.frontmatter.order ? note.frontmatter.order : i + 1}.</span>
        <span>{note.frontmatter.title}</span>
      </Link>

      <span className="text-xs text-gray-500">{note.frontmatter.date}</span>
    </li>
  );
}
