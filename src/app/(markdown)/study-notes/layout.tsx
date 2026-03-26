import NoteNav from "@/features/(markdown)/study-notes/components/note-nav/note-nav";
import { getStudyNotesTree } from "@/features/(markdown)/lib/data";
import { d2Coding } from "@/app/fonts";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = getStudyNotesTree();

  return (
    <div
      className={`${d2Coding.className} flex  
    space-x-4
   border-y border-gray-500
    mb-16`}
    >
      <NoteNav tree={tree} />
      {children}
    </div>
  );
}
