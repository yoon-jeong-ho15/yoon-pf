import { CategoryTree, NoteMeta } from "@/types";

/**
 * Perform a Depth-First Search (DFS) walk over a list of category trees or a single node.
 * Returning `false` from the visit function stops traversal immediately.
 * 
 * @param tree - A single CategoryTree node or an array of root CategoryTree nodes to traverse.
 * @param visit - A callback function invoked for each CategoryTree node. Returning false stops traversal.
 */
export function walkTree(
  tree: CategoryTree[] | CategoryTree,
  visit: (node: CategoryTree) => void | boolean,
): void {
  // Normalize the input to always be an array of roots, simplifying the iteration logic.
  const roots = Array.isArray(tree) ? tree : [tree];

  // Helper function that handles recursive traversal on a single node.
  // It returns a boolean indicating whether the traversal should continue.
  function traverse(node: CategoryTree): boolean {
    // Invoke the visitor callback for the current node.
    const continueWalk = visit(node);
    // If the visitor returns false explicitly, we stop traversing immediately.
    if (continueWalk === false) return false;

    // Recursively traverse children if there are any.
    if (node.children) {
      for (const child of node.children) {
        // If a child traversal returns false (early termination), bubble that signal up.
        if (traverse(child) === false) return false;
      }
    }
    // Return true to signal that this branch has finished traversing and walk can continue.
    return true;
  }

  // Iterate over each root node in the array.
  for (const root of roots) {
    // If any root's traversal returns false, halt the entire walk.
    if (traverse(root) === false) break;
  }
}

/**
 * Find a CategoryTree node matching the given predicate.
 * 
 * @param tree - The array of root CategoryTree nodes to search.
 * @param predicate - A callback that returns true if the node is the target.
 * @returns The matched CategoryTree node, or null if no match is found.
 */
export function findNode(
  tree: CategoryTree[],
  predicate: (node: CategoryTree) => boolean,
): CategoryTree | null {
  let matchedNode: CategoryTree | null = null;

  // Use walkTree to search. The visitor function will return false when a match
  // is found to abort the traversal early, optimizing performance.
  walkTree(tree, (node) => {
    if (predicate(node)) {
      matchedNode = node;
      return false; // Found the match! Return false to halt walkTree traversal.
    }
  });

  return matchedNode;
}

/**
 * Find the parent CategoryTree node that contains a note matching the given predicate.
 * 
 * @param tree - The array of root CategoryTree nodes to search.
 * @param predicate - A callback that returns true if the note is the target.
 * @returns The CategoryTree node containing the note, or null if not found.
 */
export function findParentCategoryOfNote(
  tree: CategoryTree[],
  predicate: (note: NoteMeta) => boolean,
): CategoryTree | null {
  let matchedNode: CategoryTree | null = null;

  // Use walkTree to visit every category node.
  walkTree(tree, (node) => {
    if (node.notes) {
      // Check if the current category has any note matching the predicate.
      const hasNote = node.notes.some(predicate);
      if (hasNote) {
        matchedNode = node;
        return false; // Found the parent category! Return false to halt traversal.
      }
    }
  });

  return matchedNode;
}

/**
 * Collect all notes recursively inside a category tree or single node.
 * 
 * @param tree - A single CategoryTree node or an array of root nodes to collect from.
 * @returns An array containing all aggregated NoteMeta objects.
 */
export function collectNotes(tree: CategoryTree[] | CategoryTree): NoteMeta[] {
  const notes: NoteMeta[] = [];

  // Traverse every node in the tree and gather their notes.
  walkTree(tree, (node) => {
    if (node.notes) {
      // Push notes to the shared array. Since we only push references, 
      // this avoids the quadratic memory allocation of Array.prototype.concat.
      notes.push(...node.notes);
    }
  });

  return notes;
}
