"use client";

import { useEffect, useState } from "react";
import { useScrollspy } from "@/hooks/useScrollspy";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const activeId = useScrollspy(
    "article h1, article h2, article h3, article h4",
    { rootMargin: "0px 0px -80% 0px" }
  );

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll(
        "article h1, article h2, article h3, article h4",
      ),
    );

    const newHeadings = elements
      .map((elem) => ({
        id: elem.id,
        text: elem.textContent || "",
        level: Number(elem.tagName.substring(1)),
      }))
      .filter((heading) => heading.id);

    setHeadings(newHeadings);
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-3">
      <h3 className="text-xs font-bold underline">on this page</h3>
      <ul className="space-y-2 text-xs">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block transition-colors hover:text-black",
                activeId === heading.id ? "font-semibold" : "text-gray-600"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
