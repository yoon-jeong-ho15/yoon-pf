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

export function findNode(
  tree: CategoryTree[],
  predicate: (node: CategoryTree) => boolean,
): CategoryTree | null {
  let matchedNode: CategoryTree | null = null;

  walkTree(tree, (node) => {
    if (predicate(node)) {
      matchedNode = node;
      return false;
    }
  });

  return matchedNode;
}

export function findParentCategoryOfNote(
  tree: CategoryTree[],
  predicate: (note: NoteMeta) => boolean,
): CategoryTree | null {
  let matchedNode: CategoryTree | null = null;

  walkTree(tree, (node) => {
    if (node.notes) {
      const hasNote = node.notes.some(predicate);
      if (hasNote) {
        matchedNode = node;
        return false;
      }
    }
  });

  return matchedNode;
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

export function getTotalNoteCount(node: CategoryTree): number {
  let count = node.notes?.length || 0;
  if (node.children) {
    for (const child of node.children) {
      count += getTotalNoteCount(child);
    }
  }
  return count;
}

