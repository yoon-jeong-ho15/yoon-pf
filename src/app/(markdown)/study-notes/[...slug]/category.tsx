import { SidebarLink } from "@/features/(markdown)/study-notes/components/frontmatter/links";
import { sortFrontmatter } from "@/features/(markdown)/utils/util";
import { CategoryTree, NoteMeta } from "@/types";
import Link from "next/link";
import { FrontmatterItem } from "@/components/ui/frontmatter";

const getAllNotes = (node: CategoryTree): NoteMeta[] => {
  let allNotes = [...(node.notes || [])];
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      allNotes = allNotes.concat(getAllNotes(child));
    });
  }
  return allNotes;
};

export default function CategoryPage({
  categoryNode,
}: {
  categoryNode: CategoryTree;
}) {
  const sortedFrontmatter = sortFrontmatter(categoryNode.frontmatter);
  const allNotes = getAllNotes(categoryNode);
  const hasNotes = allNotes.length > 0;

  return (
    <div
      className="flex flex-1 p-4 font-medium min-h-[calc(100vh-4rem)] border-l border-gray-500 md:pl-16"
    >
      <div className="flex flex-1 space-x-6 mt-14 md:mt-0">
        <div className="flex flex-col space-y-12 w-1/3 min-w-54">
          <div className="space-y-2">
            {sortedFrontmatter.map(([key, value]) => {
              return (
                <FrontmatterItem
                  key={key}
                  label={key}
                  value={value as string | string[]}
                  renderCustomValue={
                    key === "link"
                      ? (itemUrl) => <SidebarLink url={itemUrl} />
                      : undefined
                  }
                  className="bg-surface border border-gray-500"
                />
              );
            })}
          </div>
          <div className="flex flex-col bg-surface border border-gray-500 items-start gap-1">
            <div className="shrink-0 whitespace-pre bg-slate-200 px-1">
              <span className="text-blue-800">description</span>
            </div>
            <div className="px-4 py-2">
              {categoryNode.description || "null"}
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-surface border border-gray-500 flex-1 max-w-110 items-start">
          <div className="shrink-0 whitespace-pre bg-slate-200 px-1">
            <span className="text-blue-800">notes</span>
          </div>
          {hasNotes && (
            <div key="notes" className="mt-3">
              <ul className="pl-3 flex flex-col">
                {allNotes.map((note, index) => (
                  <li key={note.slug.join("/")}>
                    <Link
                      href={`/study-notes/${note.slug.join("/")}`}
                      className="hover:underline"
                    >
                      {`${note.frontmatter?.title || note.slug[note.slug.length - 1]}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
