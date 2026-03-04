import PostItem from "@/features/(markdown)/study-notes/components/post-item";

export type MobileTreeNote = {
  slug: string[];
  frontmatter: {
    title: string;
    order?: number;
    [key: string]: any;
  };
};

export default function MobileNoteList({
  displayNotes,
  setIsOpen,
}: {
  displayNotes: MobileTreeNote[];
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="flex flex-col">
      <span className="border border-gray-400 border-b-0 rounded-t-xl p-2">
        {"노트"}
      </span>
      <ul
        className="overflow-y-scroll h-46 w-full bg-slate-100 
        border border-gray-400 rounded-b-xl"
        style={{ scrollbarWidth: "none" }}
      >
        {displayNotes && displayNotes.length > 0 ? (
          displayNotes.map((note, i) => (
            <PostItem
              key={note.slug.join("/")}
              variant="mobile"
              title={note.frontmatter.title}
              order={note.frontmatter.order}
              slug={note.slug}
              i={i}
              onSelect={() => setIsOpen(false)}
            />
          ))
        ) : (
          <li className="text-center p-2 text-slate-600">노트 없음</li>
        )}
      </ul>
    </div>
  );
}
