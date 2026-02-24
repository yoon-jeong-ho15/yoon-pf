"use client";

import { Note, Series } from "@/types";
import Link from "next/link";
import { menlo } from "@/app/fonts";

export default function EmptyNote({
  label,
  text,
  subCategories,
  allNotes,
}: {
  label: string;
  text: string;
  subCategories: Series[];
  allNotes?: Note[];
}) {
  return (
    <div
      className={`${menlo.className}
      flex-1 p-5 flex flex-col gap-3
    text-2xl`}
    >
      <div className="flex flex-col">
        <span className="text-orange-700">{"<title>"}</span>
        <span className={`pl-16 text-sky-800`}>{label}</span>
        <span className="text-orange-700">{"</title>"}</span>
      </div>
      {text && (
        <div className={`flex flex-col`}>
          <span className="text-orange-700">{"<desc>"}</span>
          <span className="pl-16 text-indigo-800">{text}</span>
          <span className="text-orange-700">{"</desc>"}</span>
        </div>
      )}
      {subCategories.length > 0 && (
        <div className={`flex flex-col`}>
          <span className="text-orange-700">{"<sub>"}</span>
          {subCategories.map((sub) => (
            <span key={sub.slug.join("/")} className="flex gap-2 pl-16">
              <span className="text-orange-700">{"<li>"}</span>
              <span className="text-emerald-600">{sub.frontmatter.title}</span>
              <span className="text-orange-700">{"</li>"}</span>
            </span>
          ))}
          <span className="text-orange-700">{"</sub>"}</span>
        </div>
      )}
      {allNotes && allNotes.length > 0 && (
        <div className="flex flex-col">
          <span className="text-orange-700">{"<notes>"}</span>
          {allNotes.map((note) => (
            <Link
              key={note.slug.join("/")}
              href={`/study-notes/${note.slug.join("/")}`}
              className="flex gap-2 pl-16 hover:bg-gray-200"
            >
              <span className="text-orange-700">{"<li>"}</span>
              <span className="text-sky-600">{note.frontmatter.title}</span>
              <span className="text-orange-700">{"</li>"}</span>
            </Link>
          ))}
          <span className="text-orange-700">{"</notes>"}</span>
        </div>
      )}
    </div>
  );
}
