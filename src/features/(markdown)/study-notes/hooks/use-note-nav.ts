import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CategoryTree } from "@/types";

export function useNoteNav(tree: CategoryTree[]) {
  const pathname = usePathname();
  const [activeRootSlug, setActiveRootSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const pathParts = pathname.replace(/^\/(?:study-notes\/?)?/, "").split("/");

    const matchedRoot = pathParts[0] ? tree.find((t) => t.slug[0] === pathParts[0]) : null;

    if (matchedRoot) {
      setActiveRootSlug(matchedRoot.slug.join("/"));
    } else if (tree.length > 0) {
      setActiveRootSlug(tree[0].slug.join("/"));
    }
  }, [pathname, tree]);

  const activeRoot = tree.find((t) => t.slug.join("/") === activeRootSlug);

  let currentCategoryNode: CategoryTree | null = null;
  if (pathname) {
    const searchSlug = pathname.replace(/^\/study-notes\/?/, "");
    const findNode = (nodes: CategoryTree[]): CategoryTree | null => {
      for (const node of nodes) {
        if (node.slug.join("/") === searchSlug) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };
    currentCategoryNode = findNode(tree);
  }

  if (!currentCategoryNode && pathname) {
    const searchSlug = pathname.replace(/^\/study-notes\/?/, "");
    const findParentOfNote = (nodes: CategoryTree[]): CategoryTree | null => {
      for (const node of nodes) {
        const hasNote = node.notes.some((n) => n.slug.join("/") === searchSlug);
        if (hasNote) return node;
        const found = findParentOfNote(node.children);
        if (found) return found;
      }
      return null;
    };
    currentCategoryNode = findParentOfNote(tree);
  }

  const notesToShow = currentCategoryNode
    ? currentCategoryNode.notes
    : activeRoot
      ? activeRoot.notes
      : [];

  return {
    pathname,
    activeRootSlug,
    setActiveRootSlug,
    activeRoot,
    notesToShow,
  };
}
