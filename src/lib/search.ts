import { CategoryTree, NoteMeta } from "@/types";
import { walkTree } from "@/lib/tree";

export function searchStudyNotes(
  tree: CategoryTree[],
  query: string,
): { matchedCategories: CategoryTree[]; matchedNotes: NoteMeta[] } {
  const matchedCategories: CategoryTree[] = [];
  const matchedNotes: NoteMeta[] = [];

  if (!query) return { matchedCategories, matchedNotes };

  const lowerQuery = query.toLowerCase();

  const matchField = (field: string | string[] | undefined) => {
    if (!field) return false;
    if (Array.isArray(field)) {
      return field.some((f) => f.toLowerCase().includes(lowerQuery));
    }
    if (typeof field === "string") {
      return field.toLowerCase().includes(lowerQuery);
    }
    return false;
  };

  walkTree(tree, (node) => {
    const catFrontmatter = node.frontmatter;
    const catMatch =
      catFrontmatter.title.toLowerCase().includes(lowerQuery) ||
      matchField(catFrontmatter.topic) ||
      matchField(catFrontmatter.provide) ||
      matchField(catFrontmatter.instructor);

    if (catMatch) {
      matchedCategories.push(node);
    }

    if (node.notes) {
      for (const note of node.notes) {
        const noteFrontmatter = note.frontmatter;
        const noteMatch =
          noteFrontmatter.title.toLowerCase().includes(lowerQuery) ||
          matchField(noteFrontmatter.tags);

        if (noteMatch) {
          matchedNotes.push(note);
        }
      }
    }
  });

  return { matchedCategories, matchedNotes };
}
