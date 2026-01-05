"use client";

import type { NoteFrontmatter } from "@/types";
import { usePathname } from "next/navigation";

export default function NoteList({
  notes,
}: {
  notes: { frontmatter: NoteFrontmatter; slug: string[] }[];
}) {
  const pathname = usePathname();
  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li
          key={note.slug.join("/")}
          className={`hover:bg-gray-100 ${
            pathname.endsWith(note.slug.join("/")) ? "bg-gray-100" : ""
          }`}
        >
          <a href={`/study-notes/${note.slug.join("/")}`}>
            {note.frontmatter.title}
          </a>
          <span className="text-sm text-gray-500 ml-2">
            {note.frontmatter.date}
          </span>
        </li>
      ))}
    </ul>
  );
}
