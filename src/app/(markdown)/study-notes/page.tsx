import { getAllNotes, getDomains } from "./_lib/data";
import PostItem from "./_components/post-item";
import Link from "next/link";
import DownloadButton from "./_components/download-button";

export default async function Page() {
  const allNotes = getAllNotes();
  const sortedNotes = allNotes.sort((a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  });

  return (
    <div className="w-full max-w-none">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">최근 작성된 글</h1>
      </div>
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
