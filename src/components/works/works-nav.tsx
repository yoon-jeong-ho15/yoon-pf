"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORK_CATEGORIES } from "@/data/works";
import { cn } from "@/lib/utils";

export default function WorksNav() {
  const pathname = usePathname();
  const links = [
    { href: "/works", title: "Overview" },
    ...WORK_CATEGORIES.map((category) => ({
      href: `/works/${category.slug}`,
      title: category.title,
    })),
  ];

  return (
    <nav aria-label="작업 분류" className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? "page" : undefined}
          className={cn(
            "rounded border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
            pathname === link.href
              ? "border-foreground bg-foreground text-background"
              : "border-default hover:bg-hover-bg",
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
