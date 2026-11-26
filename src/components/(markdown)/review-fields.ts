import type { NoteFrontmatter } from "@/types";

const HIDDEN_REVIEW_FIELDS = new Set(["date", "tags"]);

const REVIEW_FIELD_ORDER = [
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

export interface ReviewDisplayField {
  key: string;
  value: string | string[];
}

function formatReviewFieldValue(value: unknown): string | string[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(String);
  return String(value);
}

/**
 * Prepares frontmatter fields for ReviewItem display by hiding internal fields,
 * preserving the canonical field order with arbitrary extra fields trailing,
 * and converting numeric values into display strings.
 */
export function getReviewDisplayFields(
  frontmatter: NoteFrontmatter & Record<string, unknown>,
): ReviewDisplayField[] {
  return Object.entries(frontmatter)
    .filter(([key]) => !HIDDEN_REVIEW_FIELDS.has(key))
    .sort(([keyA], [keyB]) => {
      const indexA = REVIEW_FIELD_ORDER.indexOf(keyA);
      const indexB = REVIEW_FIELD_ORDER.indexOf(keyB);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    })
    .flatMap(([key, rawValue]) => {
      const value = formatReviewFieldValue(rawValue);
      return value === undefined ? [] : [{ key, value }];
    });
}
