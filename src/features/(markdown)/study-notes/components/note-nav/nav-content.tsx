import Link from "next/link";
import { CategoryTree } from "@/types";
import RowScrollTabs from "@/components/row-scroll-tabs";
import CategoryTreeNode from "./tree-node";

interface NavContentProps {
  tree: CategoryTree[];
  pathname: string | null;
  activeRootSlug: string | null;
  setActiveRootSlug: (slug: string) => void;
  activeRoot: CategoryTree | undefined;
  notesToShow: CategoryTree["notes"];
  onLinkClick?: () => void;
}

export default function NavContent({
  tree,
  pathname,
  activeRootSlug,
  setActiveRootSlug,
  activeRoot,
  notesToShow,
  onLinkClick,
}: NavContentProps) {
  return (
    <>
      <RowScrollTabs className="mt-2 px-1 gap-1">
        {tree.map((rootNode) => (
          <button
            key={rootNode.slug.join("/")}
            onClick={() => setActiveRootSlug(rootNode.slug.join("/"))}
            className={`px-3 py-1.5 text-sm font-medium transition-colors shrink-0 rounded-t border border-b-0 border-gray-400
              ${
                activeRootSlug === rootNode.slug.join("/")
                  ? "bg-gray-50 text-black font-bold"
                  : "bg-gray-200 text-slate-500"
              }`}
          >
            {rootNode.frontmatter.title}
          </button>
        ))}
      </RowScrollTabs>

      <div className="flex-1 overflow-y-auto p-2">
        <h3 className="text-xs font-semibold tracking-wider mb-1 underline">
          categories
        </h3>
        {activeRoot && activeRoot.children.length > 0 ? (
          <ul className="divide-y divide-gray-100 [&>li]:py-0.5">
            {activeRoot.children.map((child) => (
              <CategoryTreeNode
                key={child.slug.join("/")}
                node={child}
                currentPath={pathname}
              />
            ))}
          </ul>
        ) : (
          <div className="text-sm italic">null</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="text-xs font-semibold tracking-wider mb-1 underline">
          notes
        </h3>
        {notesToShow.length > 0 ? (
          <ul className="space-y-1 block">
            {notesToShow.map((note) => {
              const noteHref = `/study-notes/${note.slug.join("/")}`;
              const isCurrent = pathname === noteHref;

              return (
                <li key={note.slug.join("/")}>
                  <Link
                    href={noteHref}
                    onClick={onLinkClick}
                    className={`block px-2 py-0.5 text-sm transition-colors truncate
                      ${isCurrent ? "bg-gray-100 font-medium ml-1" : " "}
                      box-border border border-transparent hover:border-y-gray-200 hover:ml-1`}
                  >
                    {note.frontmatter.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-sm italic">null</div>
        )}
      </div>
    </>
  );
}
