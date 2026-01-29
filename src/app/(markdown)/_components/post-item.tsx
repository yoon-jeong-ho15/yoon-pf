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
      className={`flex flex-col justify-center my-0.5 border-y border-transparent ${
        isSelected ? "font-semibold items-end border-gray-700" : ""
      }`}
    >
      <Link href={href} className="flex gap-1">
        <span>{note.frontmatter.order ? note.frontmatter.order : i + 1}.</span>
        <span>{note.frontmatter.title}</span>
      </Link>

      <span className="text-xs text-gray-500">{note.frontmatter.date}</span>
    </li>
  );
}
