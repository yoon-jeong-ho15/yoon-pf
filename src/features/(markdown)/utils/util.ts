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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { date, tags, ...rest } = frontmatter;
  return rest;
}

export function getDomainFromURL(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
