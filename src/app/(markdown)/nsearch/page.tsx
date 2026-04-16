import Search from "@/features/(markdown)/components/search";
import {
  getStudyNotesTree,
  searchStudyNotes,
} from "@/features/(markdown)/lib/data";
import { CategoryTree, NoteMeta } from "@/types";
import Link from "next/link";

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-yellow-300/40 px-0.5 rounded-sm">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const params = await props.searchParams;
  const query = params?.query || "";

  const tree = getStudyNotesTree();
  const { matchedCategories, matchedNotes } = searchStudyNotes(tree, query);

  return (
    <div className="flex-1 flex flex-col items-start min-h-screen p-4 gap-4">
      <div className="flex flex-wrap w-full gap-5 text-xl justify-end p-10">
        <Search path="nsearch" />
      </div>
      <div className="flex w-full p-10 gap-8">
        <div className="w-1/2 h-full bg-surface border border-gray-500 rounded p-4 flex flex-col gap-4">
          <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">
            Category Results ({matchedCategories.length})
          </h3>
          {matchedCategories.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {matchedCategories.map((cat, idx) => (
                <CategoryItem key={idx} cat={cat} query={query} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No categories found.</p>
          )}
        </div>
        <div className="w-1/2 h-full bg-surface border border-gray-500 rounded p-4 flex flex-col gap-4">
          <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">
            Note Results ({matchedNotes.length})
          </h3>
          {matchedNotes.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {matchedNotes.map((note, idx) => (
                <NoteItem key={idx} note={note} query={query} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No notes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryItem({ cat, query }: { cat: CategoryTree; query: string }) {
  return (
    <li className="p-2 border border-gray-700 rounded">
      <Link href={`/study-notes/${cat.slug.join("/")}`}>
        <div className="font-medium text-lg">
          <Highlight text={cat.frontmatter.title} query={query} />
        </div>
        {cat.frontmatter.topic && (
          <div className="text-sm text-gray-400 mt-1">
            Topic:{" "}
            <Highlight
              text={
                Array.isArray(cat.frontmatter.topic)
                  ? cat.frontmatter.topic.join(", ")
                  : String(cat.frontmatter.topic)
              }
              query={query}
            />
          </div>
        )}
        {cat.frontmatter.instructor && (
          <div className="text-sm text-gray-400 mt-1">
            Instructor:{" "}
            <Highlight
              text={
                Array.isArray(cat.frontmatter.instructor)
                  ? cat.frontmatter.instructor.join(", ")
                  : String(cat.frontmatter.instructor)
              }
              query={query}
            />
          </div>
        )}
      </Link>
    </li>
  );
}

function NoteItem({ note, query }: { note: NoteMeta; query: string }) {
  const tagsArray = Array.isArray(note.frontmatter.tags)
    ? note.frontmatter.tags
    : note.frontmatter.tags
      ? [String(note.frontmatter.tags)]
      : undefined;

  return (
    <li className="p-2 border border-gray-700 rounded">
      <Link href={`/study-notes/${note.slug.join("/")}`}>
        <div className="font-medium text-lg">
          <Highlight text={note.frontmatter.title} query={query} />
        </div>
      </Link>
      {tagsArray && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {tagsArray.map((tag, tagIdx) => (
            <span
              key={tagIdx}
              className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded-full"
            >
              #<Highlight text={tag} query={query} />
            </span>
          ))}
        </div>
      )}
      <div className="text-xs text-gray-400 mt-1">{note.frontmatter.date}</div>
    </li>
  );
}
