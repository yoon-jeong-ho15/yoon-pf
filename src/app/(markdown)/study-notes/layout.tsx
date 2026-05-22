import NoteNav from "@/features/(markdown)/study-notes/components/note-nav/note-nav";
import { getMDTree } from "@/features/(markdown)/lib/data";
import { d2Coding } from "@/app/fonts";
import { cn } from "@/lib/utils";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = getMDTree("study-notes");

  return (
    <div
      className={cn(
        d2Coding.className,
        "flex space-x-4 border-y border-gray-500 mb-16",
      )}
    >
      <NoteNav tree={tree} />
      {children}
    </div>
  );
}
