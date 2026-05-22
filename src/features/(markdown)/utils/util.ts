const FIELD_ORDER = [
  "title",
  "topic",
  "chapter",
  "date",
  "instructor",
  "author",
  "director",
  "order",
  "provide",
  "publisher",
  "year",
  "link",
  "tags",
];

export function sortFrontmatter(
  frontmatter: Record<string, string | string[]>,
) {
  return Object.entries(frontmatter).sort(([keyA], [keyB]) => {
    const indexA = FIELD_ORDER.indexOf(keyA);
    const indexB = FIELD_ORDER.indexOf(keyB);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0;
  });
}

export function parseReviewItemFrontmatter(
  frontmatter: Record<string, string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(frontmatter).filter(
      ([key]) => key !== "date" && key !== "tags",
    ),
  );
}

export function getDomainFromURL(url: string) {
  const match = url.match(/^(?:https?:\/\/)?([^\/]+)/i);
  return match ? match[1] : "";
}
