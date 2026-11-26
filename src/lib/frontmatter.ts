import type { NoteFrontmatter } from "@/types";

function normalizeStringList(value: unknown): string[] | undefined {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
}

export function normalizeFrontmatter(
  data: Record<string, unknown>,
  fallbackTitle: string,
) {
  const { title, tags, link, ...extra } = data;
  const normalizedTags = normalizeStringList(tags);
  const normalizedLink = normalizeStringList(link);

  return {
    ...extra,
    title: typeof title === "string" && title.trim() ? title : fallbackTitle,
    ...(normalizedTags !== undefined && { tags: normalizedTags }),
    ...(normalizedLink !== undefined && { link: normalizedLink }),
  };
}

export function normalizeNoteFrontmatter(
  data: Record<string, unknown>,
  fileName: string,
): NoteFrontmatter {
  const { date, order, ...metadata } = data;

  return {
    ...normalizeFrontmatter(metadata, fileName),
    date:
      date instanceof Date
        ? date.toISOString().substring(0, 10)
        : String(date || ""),
    ...(typeof order === "number" || typeof order === "string" ? { order } : {}),
  };
}

type FrontmatterDisplayValue = string | string[] | number;

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
  frontmatter: Record<string, FrontmatterDisplayValue>,
): [string, FrontmatterDisplayValue][] {
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
  frontmatter: Record<string, FrontmatterDisplayValue>,
): Record<string, FrontmatterDisplayValue> {
  return Object.fromEntries(
    Object.entries(frontmatter).filter(([key]) => key !== "date" && key !== "tags"),
  );
}

export function getDomainFromURL(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
