import { getDomains } from "@/features/(markdown)/lib/data";
import DomainTree from "./_components/domain-tree";
import MobileCategoryTree from "@/features/(markdown)/components/mobile-category-tree";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domains = getDomains();

  return (
    <div className="flex flex-col md:flex-row md:divide-x divide-gray-500 border-gray-500 md:mt-4 md:border-y mb-16">
      <div id="notes-layout-empty-l" className="hidden md:block w-3" />
      <DomainTree domains={domains} />
      <MobileCategoryTree domains={domains} />
      {children}
      <div id="notes-layout-empty-r" className="hidden md:block w-3" />
    </div>
  );
}
