const FIELD_ORDER = [
  "chapter",
  "title",
  "date",
  "category",
  "instructor",
  "order",
  "tags",
  "provide",
  "link",
];

export function sortFrontmatter(frontmatter: Record<string, any>) {
  return Object.entries(frontmatter).sort(([keyA], [keyB]) => {
    const indexA = FIELD_ORDER.indexOf(keyA);
    const indexB = FIELD_ORDER.indexOf(keyB);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0;
  });
}
