import { getAllNotes } from "@/features/(markdown)/lib/data";
import Link from "next/link";

export default async function Page() {
  const allNotes = getAllNotes();
  const sortedNotes = allNotes.sort((a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  });

  return (
    <div className="flex-1 flex flex-col divide-y divide-gray-500">
      <div className="flex items-center gap-2 mb-4"></div>
      <ul className="flex flex-col gap-2">
        {sortedNotes.map((note, i) => (
          <li key={note.slug.join("/")} className="flex items-center gap-2">
            <Link href={`/study-notes/${note.slug.join("/")}`}>
              {note.frontmatter.title}
            </Link>
            <span className="text-xs text-gray-500">
              {note.frontmatter.date}
            </span>
            <span>{note.slug.slice(0, note.slug.length - 1).join(" > ")}</span>
            <div>{note.frontmatter.tags?.join(", ")}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
