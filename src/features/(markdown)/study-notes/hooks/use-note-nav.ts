import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CategoryTree } from "@/types";
import { findNode, findParentCategoryOfNote } from "@/features/(markdown)/utils/tree-utils";

export function useNoteNav(tree: CategoryTree[]) {
  const pathname = usePathname();
  const [activeRootSlug, setActiveRootSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const pathParts = pathname.replace(/^\/(?:study-notes\/?)?/, "").split("/");

    const matchedRoot = pathParts[0]
      ? tree.find((t) => t.slug[0] === pathParts[0])
      : null;

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

    currentCategoryNode = findNode(
      tree,
      (node) => node.slug.join("/") === searchSlug,
    );

    if (!currentCategoryNode) {
      currentCategoryNode = findParentCategoryOfNote(
        tree,
        (note) => note.slug.join("/") === searchSlug,
      );
    }
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
