import { Note } from "@/types";
import PostItem from "./post-item";

interface CategoryNoteListProps {
  notes: Note[];
}

export default function CategoryNoteList({ notes }: CategoryNoteListProps) {
  const sortedNotes = [...notes].sort((a, b) => {
    return (a.frontmatter.order || 0) - (b.frontmatter.order || 0);
  });

  return (
    <ul
      className="w-1/3 xl:w-full flex flex-col 
    overflow-y-scroll scrollbar-minimal 
    bg-white/30"
    >
      {sortedNotes.map((note, i) => (
        <PostItem key={note.slug.join("/")} note={note} i={i} />
      ))}
    </ul>
  );
}
