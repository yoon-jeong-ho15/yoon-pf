"use client";

import { useEffect, useState } from "react";
import { robotoMono } from "@/app/fonts";
import { cn } from "@/lib/utils";

const LINES = ["𓆝 𓆟 𓆞 𓆝 𓆟", "안녕하세요?", "저는 윤정호입니다.", "𓀇 𓀡 𓀄 𓀩 𓀦 𓀔 𓀋"];
const LINE_CODE_POINTS = LINES.map((line) => Array.from(line));
const TYPING_INTERVAL_MS = 90;

export default function IntroMotion() {
  const [{ lineIndex, charCount }, setProgress] = useState({
    lineIndex: 0,
    charCount: 0,
  });

  const isComplete = lineIndex >= LINES.length;
  const completedLines = LINES.slice(0, lineIndex);
  const displayedText = isComplete
    ? ""
    : LINE_CODE_POINTS[lineIndex].slice(0, charCount).join("");

  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const currentLineLength = LINE_CODE_POINTS[prev.lineIndex].length;
        if (prev.charCount < currentLineLength) {
          return { lineIndex: prev.lineIndex, charCount: prev.charCount + 1 };
        }
        return { lineIndex: prev.lineIndex + 1, charCount: 0 };
      });
    }, TYPING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <div
      className={cn(
        "w-full h-full flex items-center",
        robotoMono.className,
      )}
    >
      <div className="text-2xl md:text-4xl space-y-2">
        {completedLines.map((line, index) => (
          <div key={index} className="flex items-center">
            {line}
            {index === LINES.length - 1 && isComplete && <Cursor />}
          </div>
        ))}
        {!isComplete && (
          <div className="flex items-center">
            {displayedText}
            <Cursor />
          </div>
        )}
      </div>
    </div>
  );
}

function Cursor() {
  return (
    <span
      aria-hidden="true"
      className="w-1 h-8 md:h-10 bg-foreground ml-2 animate-blink"
    />
  );
}