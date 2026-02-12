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
    <div className="flex flex-col lg:flex-row lg:divide-x divide-gray-500 border-gray-500 lg:mt-4 lg:border-y mb-16">
      <div className="hidden lg:block w-3" />
      <DomainTree domains={domains} />
      <MobileCategoryTree domains={domains} />
      {children}
      <div className="hidden lg:block w-3" />
    </div>
  );
}
