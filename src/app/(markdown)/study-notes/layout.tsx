import { getDomains } from "@/features/(markdown)/lib/data";
import DomainTree from "./_components/domain-tree";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domains = getDomains();

  return (
    <div className="flex divide-x divide-gray-500 border-y border-gray-500 mt-4 mb-16">
      <div className="hidden lg:block w-3" />
      <DomainTree domains={domains} />
      {children}
      <div className="hidden lg:block w-3" />
    </div>
  );
}
