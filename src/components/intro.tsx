"use client";


import { useEffect, useState } from "react";
import { robotoMono } from "@/app/fonts";
import { cn } from "@/lib/utils";

const lines = ["Hello", "안녕하세요?"];

export default function IntroMotion() {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];
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
    }, 80);

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
        className="text-2xl md:text-4xl animate-fade-in"
      >
        {completedLines.map((line, index) => (
          <div key={index} className="flex">
            {line}
            {index === lines.length - 1 && currentLineIndex >= lines.length && (
              <span
                className="inline-block w-1 h-8 md:h-10 bg-foreground ml-1 animate-blink"
              />
            )}
          </div>
        ))}
        {currentLineIndex < lines.length && (
          <div>
            {displayedText}
            <span
              className="inline-block w-1 h-8 md:h-10 bg-foreground ml-1 animate-blink"
            />
          </div>
        )}
      </div>
    </div>
  );
}
