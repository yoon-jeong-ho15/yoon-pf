import { Note } from "@/types";
import { markdownToHtml } from "@/lib/markdown";

export default async function NoteDetail({ note }: { note: Note | undefined }) {
  if (!note) return null;

  const contentHtml = await markdownToHtml(note.body);

  return (
    <article className="prose dark:prose-invert max-w-none w-full p-4">
      <h1 className="text-3xl font-bold mb-2">{note.frontmatter.title}</h1>
      <div className="text-gray-500 mb-8">{note.frontmatter.date}</div>
      <div
        dangerouslySetInnerHTML={{ __html: contentHtml }}
        className="markdown-content"
      />
    </article>
  );
}
