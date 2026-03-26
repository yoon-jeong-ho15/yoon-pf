import TopButton from "@/components/top-button";
import { sortFrontmatter } from "@/features/(markdown)/utils/util";
import { NoteMeta } from "@/types";

import TableOfContents from "@/features/(markdown)/components/table-of-contents";

export default function NotePage({
  noteMeta,
  content,
}: {
  noteMeta: NoteMeta;
  content: string;
}) {
  const sortedFrontmatter = sortFrontmatter(noteMeta.frontmatter);

  return (
    <div
      className={`flex-1 flex divide-x divide-gray-500 font-medium bg-surface border-l border-gray-500`}
    >
      <main className="flex-1 flex flex-col divide-y divide-gray-400 min-h-screen">
        <div className="text-green-800 p-5 space-y-2 text-lg">
          {sortedFrontmatter.map(([key, value]) => (
            <div key={key} className="">
              <span>{key}</span>
              <span>{" : "}</span>
              <span>{`"${value}"`}</span>
            </div>
          ))}
        </div>
        <article
          className="prose my-8 text-sm max-w-[90dvw] md:max-w-xl lg:max-w-2xl xl:text-base xl:max-w-3xl mx-auto px-4 2xl:px-0"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
      <aside className="hidden xl:block w-64 p-5 sticky top-0 max-h-screen overflow-y-auto shrink-0">
        <TableOfContents />
      </aside>
      <TopButton />
    </div>
  );
}
