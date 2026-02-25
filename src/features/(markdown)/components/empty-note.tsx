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
      p-5 w-full flex flex-col gap-3 bg-linear-to-b from-slate-50 to-white
    text-lg`}
    >
      <div className="flex flex-col">
        <span className="text-orange-700">{"<title>"}</span>
        <span className={`pl-16 text-sky-800`}>{label}</span>
        <span className="text-orange-700">{"</title>"}</span>
      </div>
      {text && (
        <div className={`flex flex-col`}>
          <span className="text-orange-700">{"<desc>"}</span>
          <span className="pl-10 text-indigo-800">{text}</span>
          <span className="text-orange-700">{"</desc>"}</span>
        </div>
      )}
      {subCategories.length > 0 && (
        <div className={`flex flex-col`}>
          <span className="text-orange-700">{"<sub>"}</span>
          {subCategories.map((sub) => (
            <span
              key={sub.slug.join("/")}
              className="flex flex-col md:flex-row md:gap-2 pl-10"
            >
              <span className="text-orange-700">{"<li>"}</span>
              <span className="text-emerald-600 ml-10 md:ml-0">
                {sub.frontmatter.title}
              </span>
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
              className="flex w-fit ml-10 px-1 gap-2 hover:bg-gray-200 
              "
            >
              <span className="text-orange-700">{"<a>"}</span>
              <span className="text-sky-600">{note.frontmatter.title}</span>
              <span className="text-orange-700">{"</a>"}</span>
            </Link>
          ))}
          <span className="text-orange-700">{"</notes>"}</span>
        </div>
      )}
    </div>
  );
}
