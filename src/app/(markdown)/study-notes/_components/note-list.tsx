import PostItem from "@/features/(markdown)/components/post-item";
import { Note } from "@/types";

export default function NoteList({
  notes,
  fullWidth,
}: {
  notes: Note[];
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`flex flex-col flex-1 min-w-0 xl:w-full xl:basis-90 xl:grow-0 border-r-0 ${
        fullWidth ? "" : ""
      }`}
    >
      <span
        className="flex items-center py-2 pl-3 border-b border-dashed border-gray-500 
      font-semibold bg-gray-200"
      >
        노트
      </span>
      <ul className="flex flex-col overflow-y-scroll scrollbar-minimal">
        {notes.map((note, i) => (
          <PostItem
            key={note.slug.join("/")}
            title={note.frontmatter.title}
            order={note.frontmatter.order}
            slug={note.slug}
            i={i}
          />
        ))}
      </ul>
    </div>
  );
}
