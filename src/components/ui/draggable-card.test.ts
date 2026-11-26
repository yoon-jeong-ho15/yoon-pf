import { describe, expect, test } from "vitest";
import {
  calculateTranslationBounds,
  clampCardPosition,
} from "./draggable-card";

describe("DraggableCard coordinate bounds calculation", () => {
  test("computes translation bounds relative to the card's un-translated origin", () => {
    const boundary = { left: 100, top: 50, right: 600, bottom: 450 };

    // Card is 200x100 and currently un-translated at (150, 120).
    const initialBounds = calculateTranslationBounds(
      { left: 150, top: 120, width: 200, height: 100 },
      { x: 0, y: 0 },
      boundary,
    );
    expect(initialBounds).toEqual({
      minX: -50,
      maxX: 250,
      minY: -70,
      maxY: 230,
    });

    // Same card while translated by (+300, -100): rect shifted, but origin remains (150, 120).
    const movedBounds = calculateTranslationBounds(
      { left: 450, top: 20, width: 200, height: 100 },
      { x: 300, y: -100 },
      boundary,
    );
    expect(movedBounds).toEqual(initialBounds);
  });

  test("normalizes min/max bounds when the card is larger than its boundary", () => {
    const bounds = calculateTranslationBounds(
      { left: 50, top: 40, width: 400, height: 300 },
      { x: 0, y: 0 },
      { left: 50, top: 40, right: 350, bottom: 240 },
    );

    expect(bounds).toEqual({
      minX: -100,
      maxX: 0,
      minY: -100,
      maxY: 0,
    });
  });

  test("clamps coordinates outside bounds and preserves coordinates inside bounds", () => {
    const bounds = { minX: -50, maxX: 250, minY: -70, maxY: 230 };

    expect(clampCardPosition({ x: 40, y: -10 }, bounds)).toEqual({ x: 40, y: -10 });
    expect(clampCardPosition({ x: 400, y: 350 }, bounds)).toEqual({ x: 250, y: 230 });
    expect(clampCardPosition({ x: -120, y: -150 }, bounds)).toEqual({ x: -50, y: -70 });
  });
});
