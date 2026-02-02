"use client";

import { NoteFrontmatter } from "@/types";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function PostItem({
  note,
  i,
}: {
  note: { frontmatter: NoteFrontmatter; slug: string[] };
  i: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const isSelected = pathname.endsWith(note.slug.join("/"));

  const href = `/study-notes/${note.slug.join("/")}${
    page ? `?page=${page}` : ""
  }`;

  return (
    <li
      className={`flex flex-col my-0.5 py-0.5 min-w-0 ${
        isSelected ? "font-semibold border-y-2 border-indigo-800" : ""
      }`}
    >
      <Link href={href} className="flex items-center gap-1 overflow-hidden">
        <span className="text-slate-700 text-sm">
          {note.frontmatter.order ? note.frontmatter.order : i + 1}.
        </span>
        <span className="truncate">{note.frontmatter.title}</span>
      </Link>

      <span className="text-xs text-gray-500">{note.frontmatter.date}</span>
    </li>
  );
}
