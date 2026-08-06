"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CategoryTree } from "@/types";
import { cn } from "@/lib/utils";
import { getTotalNoteCount } from "@/lib/tree";

export default function CategoryTreeNode({
  node,
  currentPath,
  onLinkClick,
}: {
  node: CategoryTree;
  currentPath: string | null;
  onLinkClick?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const href = `/study-notes/${node.slug.join("/")}`;
  const isCurrent = currentPath === href || currentPath?.startsWith(href + "/");

  useEffect(() => {
    if (isCurrent) {
      setIsExpanded(true);
    }
  }, [isCurrent]);

  const totalNotes = getTotalNoteCount(node);

  return (
    <li className="select-none">
      <div className="flex items-center group">
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          className={cn("p-1", node.children.length === 0 && "invisible")}
        >
          {isExpanded ? (
            <ChevronDownIcon className="w-3.5 h-3.5" />
          ) : (
            <ChevronRightIcon className="w-3.5 h-3.5" />
          )}
        </button>

        <Link
          href={href}
          onClick={onLinkClick}
          className={cn(
            "flex flex-1 items-center min-w-0 ml-1 p-1 text-sm transition-colors hover:pl-3",
            isCurrent && "bg-linear-to-r from-layout-bg to-surface italic pl-3"
          )}
        >
          <span className="truncate">{node.frontmatter.title}</span>
          <span className="text-xs text-text-secondary ml-1 shrink-0">{`(${totalNotes})`}</span>
        </Link>
      </div>

      {isExpanded && node.children.length > 0 && (
        <ul className="ml-2 border-l border-muted pl-1 space-y-1">
          {node.children.map((child) => (
            <CategoryTreeNode
              key={child.slug.join("/")}
              node={child}
              currentPath={currentPath}
              onLinkClick={onLinkClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
