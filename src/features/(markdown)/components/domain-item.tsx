"use client";

import Link from "next/link";
import { CategoryFrontmatter } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function DomainItem({
  type,
  frontmatter,
  slug,
  children,
}: {
  type: "mobile" | "desktop";
  frontmatter: CategoryFrontmatter;
  slug: string[];
  children?: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: "instant",
      });
    };

    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  if (type === "desktop") {
    return (
      <li>
        <Link
          href={`/study-notes/${slug.join("/")}`}
          className={`flex justify-center items-center gap-3 border-b border-dashed py-2
            border-gray-400
            bg-gray-200
          `}
        >
          <span className="font-bold text-xl">{frontmatter.title}</span>
        </Link>
        {children}
      </li>
    );
  }
  if (type === "mobile") {
    return (
      <li
        ref={scrollRef}
        className="flex overflow-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <Link
          href={`/study-notes/${slug.join("/")}`}
          className={`flex justify-center items-center border-r border-dashed py-2
            border-gray-400 min-w-24 
            bg-gray-200
          `}
        >
          <span className="font-semibold">{frontmatter.title}</span>
        </Link>
        {children}
      </li>
    );
  }
}
