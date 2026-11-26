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
