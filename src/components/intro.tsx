"use client";


import { useEffect, useState } from "react";
import { robotoMono } from "@/app/fonts";
import { cn } from "@/lib/utils";

const LINES = ["𓆝 𓆟 𓆞 𓆝 𓆟", "Hello!", "안녕하세요?", "저는 윤정호 입니다.", "𓀇 𓀡 𓀄 𓀩 𓀦 𓀔 𓀋"];

export default function IntroMotion() {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (currentLineIndex >= LINES.length) return;

    const currentLine = LINES[currentLineIndex];
    let i = 0;

    const interval = setInterval(() => {
      setDisplayedText(currentLine.substring(0, i + 1));
      i++;
      if (i > currentLine.length) {
        clearInterval(interval);
        setCompletedLines((prev) => [...prev, currentLine]);
        setDisplayedText("");
        setCurrentLineIndex((prev) => prev + 1);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [currentLineIndex]);

  return (
    <div
      className={cn(
        "w-full h-full flex items-center",
        robotoMono.className
      )}
    >
      <div
        className="text-2xl md:text-4xl space-y-2"
      >
        {completedLines.map((line, index) => (
          <div key={index} className="flex items-center">
            {line}
            {index === LINES.length - 1 && currentLineIndex >= LINES.length && (
              <Cursor />
            )}
          </div>
        ))}
        {currentLineIndex < LINES.length && (
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
      className="w-1 h-8 md:h-10 bg-foreground ml-2 animate-blink"
    />
  )
}