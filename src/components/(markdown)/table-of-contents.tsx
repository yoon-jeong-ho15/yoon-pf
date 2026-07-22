"use client";

import { useEffect, useState } from "react";
import { useScrollspy } from "@/hooks/useScrollspy";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface Heading {
  id: string;
  text: string;
  level: number;
}

const HEADING_SELECTOR = "article h1, article h2, article h3, article h4";
const SCROLLSPY_OPTIONS: IntersectionObserverInit = {
  rootMargin: "0px 0px -80% 0px",
};

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const pathname = usePathname();
  const activeId = useScrollspy(HEADING_SELECTOR, SCROLLSPY_OPTIONS);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
    );

    const newHeadings = elements
      .map((elem) => ({
        id: elem.id,
        text: elem.textContent || "",
        level: Number(elem.tagName.substring(1)),
      }))
      .filter((heading) => heading.id);

    setHeadings(newHeadings);
  }, [pathname]);

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
                "block transition-colors hover:text-foreground",
                activeId === heading.id ? "font-semibold" : "text-text-secondary"
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
