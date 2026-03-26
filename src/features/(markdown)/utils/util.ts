const FIELD_ORDER = [
  "title",
  "topic",
  "chapter",
  "date",
  "instructor",
  "author",
  "order",
  "provide",
  "publish",
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

export function getDomainFromURL(url: string) {
  const match = url.match(/^(?:https?:\/\/)?([^\/]+)/i);
  return match ? match[1] : "";
}
