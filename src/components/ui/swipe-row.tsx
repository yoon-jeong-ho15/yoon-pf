"use client";
import React from "react";
import { useSwipeScroll } from "@/hooks/useSwipeScroll";
import { useScrollToActive } from "@/hooks/useScrollToActive";
import { cn } from "@/lib/utils";

export default function SwipeRow({
  children,
  className,
  activeSelector,
}: {
  children: React.ReactNode;
  className?: string;
  activeSelector?: string | null;
}) {
  const scrollRef = useSwipeScroll<HTMLDivElement>();

  useScrollToActive<HTMLDivElement>(
    activeSelector || null,
    { inline: "center", block: "nearest" },
    scrollRef,
  );

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex overflow-x-hidden select-none cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      {children}
    </div>
  );
}
