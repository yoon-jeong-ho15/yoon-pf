import { getDomains } from "@/features/(markdown)/lib/data";
import NoteNav from "@/features/(markdown)/study-notes/components/note-nav";
import { d2Coding } from "@/app/fonts";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domains = getDomains();

  return (
    <div
      className={`${d2Coding.className} flex flex-col 
    md:divide-y md:divide-x-0
    xl:flex-row xl:divide-y-0 xl:divide-x xl:mt-4 xl:border-y 
    divide-gray-500 border-gray-500
    mb-16`}
    >
      <NoteNav domains={domains} />
      {children}
    </div>
  );
}
