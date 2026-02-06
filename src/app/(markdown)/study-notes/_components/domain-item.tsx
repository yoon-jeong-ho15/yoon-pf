"use client";

import Link from "next/link";
import { CategoryFrontmatter, Domain } from "@/types";
import { usePathname } from "next/navigation";
import { LinkMetadata } from "@/lib/metadata";

export default function DomainItem({
  type,
  frontmatter,
  slug,
  children,
}: {
  type: "full" | "compact";
  frontmatter: CategoryFrontmatter;
  slug: string[];
  children?: React.ReactNode;
  description?: string;
  metadataMap?: Record<string, LinkMetadata>;
}) {
  const pathname = usePathname();

  const isSelected = pathname.startsWith(`/study-notes/${slug.join("/")}`);

  if (type === "compact") {
    return (
      <li>
        <Link
          href={`/study-notes/${slug.join("/")}`}
          className={`flex justify-center items-center gap-3 border-b py-2 border-gray-400
        ${isSelected ? "bg-selected-gradient text-black" : "bg-gray-200"}
      `}
        >
          <span className="font-bold text-xl">{frontmatter.title}</span>
        </Link>
        {children}
      </li>
    );
  }
}
