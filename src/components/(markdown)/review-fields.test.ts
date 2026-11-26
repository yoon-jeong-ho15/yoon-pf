import { describe, expect, test } from "vitest";
import { getReviewDisplayFields } from "./review-fields";

describe("getReviewDisplayFields", () => {
  test("hides date and tags, sorts known fields in canonical order, converts numbers, and preserves arbitrary extra fields", () => {
    const fields = getReviewDisplayFields({
      link: ["https://example.com/a", "https://example.org/b"],
      tags: ["fiction", "sci-fi"],
      rating: 5,
      author: "Octavia Butler",
      customNote: "First edition",
      date: "2024-01-02",
      year: 1979,
      order: 2,
      title: "Kindred",
    });

    expect(fields).toEqual([
      { key: "title", value: "Kindred" },
      { key: "author", value: "Octavia Butler" },
      { key: "order", value: "2" },
      { key: "year", value: "1979" },
      { key: "link", value: ["https://example.com/a", "https://example.org/b"] },
      { key: "rating", value: "5" },
      { key: "customNote", value: "First edition" },
    ]);
  });

  test("omits undefined optional fields", () => {
    const fields = getReviewDisplayFields({
      title: "Untitled",
      date: "",
      order: undefined,
    });

    expect(fields).toEqual([{ key: "title", value: "Untitled" }]);
  });
});
