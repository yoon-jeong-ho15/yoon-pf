import Link from "next/link";
import { CategoryTree } from "@/types";
import SwipeTab from "@/components/ui/swipe-tab";
import CategoryTreeNode from "./tree-node";
import { cn } from "@/lib/utils";

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
      <div className="relative mt-2 -mb-px z-10">
        <SwipeTab className="px-6 gap-1">
          {tree.map((rootNode) => {
            const isActive = activeRootSlug === rootNode.slug.join("/");
            return (
              <SwipeTab.Item
                key={rootNode.slug.join("/")}
                active={isActive}
                onClick={() => setActiveRootSlug(rootNode.slug.join("/"))}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors shrink-0 rounded-t border",
                  isActive
                    ? "bg-surface text-foreground font-bold border-b-transparent"
                    : "bg-layout-bg text-text-muted",
                )}
              >
                {rootNode.frontmatter.title}
              </SwipeTab.Item>
            );
          })}
        </SwipeTab>
      </div>
      <div className="flex-1 flex flex-col border-y">
        <div className="flex-1 p-2">
          <h3 className="text-xs font-semibold tracking-wider mb-1 underline">
            categories
          </h3>
          {activeRoot && activeRoot.children.length > 0 ? (
            <ul className="divide-y divide-muted/80 [&>li]:py-0.5">
              {activeRoot.children.map((child) => (
                <CategoryTreeNode
                  key={child.slug.join("/")}
                  node={child}
                  currentPath={pathname}
                  onLinkClick={onLinkClick}
                />
              ))}
            </ul>
          ) : (
            <div className="text-sm italic">null</div>
          )}
        </div>

        <div className="flex-1 m-2 p-2 rounded-lg border border-muted">
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
                      className={cn(
                        "block px-2 py-0.5 text-sm transition-colors truncate box-border border border-transparent hover:border-y-muted hover:ml-1",
                        isCurrent && "bg-hover-bg font-medium ml-1",
                      )}
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
      </div>
    </>
  );
}
