import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import IntroMotion from "./intro";

let root: Root | undefined;
let host: HTMLDivElement | undefined;

async function flushRender(callback: () => void | Promise<void>) {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  try {
    await act(callback);
  } finally {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: false });
  }
}

async function renderIntro() {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await flushRender(() => root?.render(<IntroMotion />));
}

async function advanceTicks(ticks: number) {
  await flushRender(async () => {
    await vi.advanceTimersByTimeAsync(ticks * 90);
  });
}

function getLineElements() {
  const container = host?.querySelector(".space-y-2");
  return Array.from(container?.children ?? []) as HTMLElement[];
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(async () => {
  await flushRender(() => root?.unmount());
  host?.remove();
  root = undefined;
  vi.useRealTimers();
});

test("types code points at 90ms intervals, transitions lines cleanly, and keeps cursor on the final line", async () => {
  await renderIntro();

  // Initial state: single empty active line with cursor.
  let lines = getLineElements();
  expect(lines).toHaveLength(1);
  expect(lines[0].textContent).toBe("");
  expect(lines[0].querySelector(".animate-blink")).not.toBeNull();

  // 1. First tick (90ms): renders the full first Unicode code point "𓆝" (not a lone surrogate).
  await advanceTicks(1);
  lines = getLineElements();
  expect(lines).toHaveLength(1);
  expect(lines[0].textContent).toBe("𓆝");
  expect(Array.from(lines[0].textContent ?? "")).toEqual(["𓆝"]);

  // Finish remaining 8 code points of line 0 ("𓆝 𓆟 𓆞 𓆝 𓆟" has 9 code points total).
  await advanceTicks(8);
  lines = getLineElements();
  expect(lines).toHaveLength(1);
  expect(lines[0].textContent).toBe("𓆝 𓆟 𓆞 𓆝 𓆟");

  // 2. Line transition (tick 10): line 0 becomes completed and line 1 starts with cursor.
  await advanceTicks(1);
  lines = getLineElements();
  expect(lines).toHaveLength(2);
  expect(lines[0].textContent).toBe("𓆝 𓆟 𓆞 𓆝 𓆟");
  expect(lines[0].querySelector(".animate-blink")).toBeNull();
  expect(lines[1].textContent).toBe("");
  expect(lines[1].querySelector(".animate-blink")).not.toBeNull();

  // First character of line 1 ("안녕하세요?" -> 6 code points).
  await advanceTicks(1);
  lines = getLineElements();
  expect(lines[1].textContent).toBe("안");

  // Complete line 1 (5 remaining chars + 1 transition) and line 2 ("저는 윤정호입니다.", 10 chars + 1 transition).
  await advanceTicks(6 + 11);
  lines = getLineElements();
  expect(lines).toHaveLength(4);
  expect(lines.slice(0, 3).map((el) => el.textContent)).toEqual([
    "𓆝 𓆟 𓆞 𓆝 𓆟",
    "안녕하세요?",
    "저는 윤정호입니다.",
  ]);
  expect(lines[3].textContent).toBe("");

  // First character of line 3 renders the full code point "𓀇".
  await advanceTicks(1);
  lines = getLineElements();
  expect(lines[3].textContent).toBe("𓀇");
  expect(Array.from(lines[3].textContent ?? "")).toEqual(["𓀇"]);

  // 3. Complete line 3 ("𓀇 𓀡 𓀄 𓀩 𓀦 𓀔 𓀋" has 13 code points: 12 remaining + 1 completion tick).
  await advanceTicks(13);
  lines = getLineElements();
  expect(lines).toHaveLength(4);
  expect(lines.map((el) => el.textContent)).toEqual([
    "𓆝 𓆟 𓆞 𓆝 𓆟",
    "안녕하세요?",
    "저는 윤정호입니다.",
    "𓀇 𓀡 𓀄 𓀩 𓀦 𓀔 𓀋",
  ]);
  expect(lines[3].querySelector(".animate-blink")).not.toBeNull();

  // Further timer ticks do not add lines or alter completed state.
  await advanceTicks(10);
  lines = getLineElements();
  expect(lines).toHaveLength(4);
  expect(lines[3].querySelector(".animate-blink")).not.toBeNull();
});
