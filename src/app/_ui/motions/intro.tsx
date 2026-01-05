"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { robotoMono } from "@/app/fonts";

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
      className={`
    w-full h-full 
    flex items-center 
    ${robotoMono.className}
    `}
    >
      <motion.div
        className="text-2xl md:text-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {completedLines.map((line, index) => (
          <div key={index} className="flex">
            {line}
            {index === lines.length - 1 && currentLineIndex >= lines.length && (
              <motion.span
                className="inline-block w-1 h-8 md:h-10 bg-black ml-1"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
          </div>
        ))}
        {currentLineIndex < lines.length && (
          <div>
            {displayedText}
            <motion.span
              className="inline-block w-1 h-8 md:h-10 bg-black ml-1"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
