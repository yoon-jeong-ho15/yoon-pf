"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CategoryTree } from "@/types";
import { cn } from "@/lib/utils";

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
  const isCurrent = currentPath?.includes(href);

  useEffect(() => {
    if (isCurrent) {
      setIsExpanded(true);
    }
  }, [isCurrent]);

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
            "flex-1 ml-1 p-1 text-sm transition-colors truncate hover:pl-3",
            isCurrent && "bg-linear-to-r from-gray-200 to-gray-50 italic pl-3"
          )}
        >
          <span>{node.frontmatter.title}</span>
          <span className="text-xs text-gray-600 ml-1">{`(${node.notes.length})`}</span>
        </Link>
      </div>

      {isExpanded && node.children.length > 0 && (
        <ul className="ml-2 border-l pl-1 space-y-1">
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
