import NoteNav from "@/components/(markdown)/note-nav/note-nav";
import { getMDTree } from "@/lib/data";
import { d2Coding } from "@/app/fonts";
import { cn } from "@/lib/utils";

export default async function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = await getMDTree("study-notes");

  return (
    <div
      className={cn(
        d2Coding.className,
        "flex space-x-4 border-y border-default mb-16",
      )}
    >
      <NoteNav tree={tree} />
      {children}
    </div>
  );
}
