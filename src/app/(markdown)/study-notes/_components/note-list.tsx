import PostItem from "@/features/(markdown)/components/post-item";
import { Note } from "@/types";

export default function NoteList({ notes }: { notes: Note[] }) {
  return (
    <div className="flex flex-col w-1/2 xl:w-full border-r-0">
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
