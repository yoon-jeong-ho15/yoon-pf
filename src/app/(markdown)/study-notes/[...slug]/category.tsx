import { SidebarLink } from "@/components/(markdown)/links";
import { sortFrontmatter } from "@/lib/frontmatter";
import { CategoryTree } from "@/types";
import Link from "next/link";
import { FrontmatterItem } from "@/components/ui/frontmatter";
import { collectNotes } from "@/lib/tree";

export default function CategoryPage({
  categoryNode,
}: {
  categoryNode: CategoryTree;
}) {
  const sortedFrontmatter = sortFrontmatter(categoryNode.frontmatter);
  const allNotes = collectNotes(categoryNode);
  const hasNotes = allNotes.length > 0;

  return (
    <div className="flex flex-1 p-4 font-medium min-h-[calc(100vh-4rem)] border-l border-default md:pl-16">
      <div className="flex flex-1 space-x-6 mt-14 md:mt-0">
        <div className="flex flex-col space-y-12 w-1/3 min-w-54">
          <div className="space-y-2">
            {sortedFrontmatter.map(([key, value]) => {
              const renderers: Record<string, (val: string) => React.ReactNode> = {
                link: (itemUrl) => <SidebarLink url={itemUrl} />,
              };
              return (
                <FrontmatterItem
                  key={key}
                  label={key}
                  value={value as string | string[]}
                  variant="note"
                  layout={key === "link" ? "col" : "auto"}
                  renderCustomValue={renderers[key]}
                />
              );
            })}
          </div>
          <div className="flex flex-col bg-surface border border-muted rounded items-start gap-1">
            <div className="shrink-0 whitespace-pre bg-tag-bg px-1">
              <span className="text-tag-text">description</span>
            </div>
            <div className="px-4 py-2">
              {categoryNode.description || "null"}
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-surface border border-muted rounded flex-1 max-w-110 items-start">
          <div className="shrink-0 whitespace-pre bg-tag-bg px-1">
            <span className="text-tag-text">notes</span>
          </div>
          {hasNotes && (
            <div key="notes" className="mt-3">
              <ul className="pl-3 flex flex-col">
                {allNotes.map((note) => (
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
