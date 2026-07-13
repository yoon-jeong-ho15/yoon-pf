import { useState, useEffect, useMemo } from "react";
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

  const activeRoot = useMemo(() => {
    return tree.find((t) => t.slug.join("/") === activeRootSlug);
  }, [tree, activeRootSlug]);

  const currentCategoryNode = useMemo(() => {
    if (!pathname) return null;
    const searchSlug = pathname.replace(/^\/study-notes\/?/, "");

    let node = findNode(
      tree,
      (n) => n.slug.join("/") === searchSlug,
    );

    if (!node) {
      node = findParentCategoryOfNote(
        tree,
        (note) => note.slug.join("/") === searchSlug,
      );
    }

    return node;
  }, [pathname, tree]);

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
