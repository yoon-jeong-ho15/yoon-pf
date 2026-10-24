import { CategoryTree, NoteMeta } from "@/types";

export function walkTree(
  tree: CategoryTree[] | CategoryTree,
  visit: (node: CategoryTree) => void | boolean,
): void {
  const roots = Array.isArray(tree) ? tree : [tree];

  function traverse(node: CategoryTree): boolean {
    const continueWalk = visit(node);
    if (continueWalk === false) return false;

    if (node.children) {
      for (const child of node.children) {
        if (traverse(child) === false) return false;
      }
    }
    return true;
  }

  for (const root of roots) {
    if (traverse(root) === false) break;
  }
}

export function collectNotes(tree: CategoryTree[] | CategoryTree): NoteMeta[] {
  const notes: NoteMeta[] = [];

  walkTree(tree, (node) => {
    if (node.notes) {
      notes.push(...node.notes);
    }
  });

  return notes;
}

