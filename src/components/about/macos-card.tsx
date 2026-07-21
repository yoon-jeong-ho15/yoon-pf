"use client";

import React from "react";
import { DraggableCard } from "../ui/draggable-card";
import { cn } from "@/lib/utils";

interface MacosCardProps {
  children: React.ReactNode;      // The main content to be rendered inside the macOS window
  title: string;                  // The title text displayed in the center of the macOS title bar
  className?: string;             // Optional custom CSS classes for the outer wrapper
  randomizePosition?: boolean;    // If true, randomly offsets the card's position on initial load
  containerSelector?: string;     // CSS selector for the boundary container within which the card can be dragged
}

export function MacosCard({
  children,
  title,
  className,
  randomizePosition = false,
  containerSelector,
}: MacosCardProps) {
  return (
    // 1. DraggableCard: Provides the React Context and mouse/pointer movement handlers
    <DraggableCard
      randomizePosition={randomizePosition}
      containerSelector={containerSelector}
      className={cn("w-full max-w-xl", className)} // cn utility merges default width classes with custom className props
    >
      {/* 2. Main Window Container: Styles the card with macOS styling (background, border, shadow, rounded corners) */}
      <div className="bg-surface border border-default rounded-lg overflow-hidden flex flex-col shadow-md w-full h-full">

        {/* 3. macOS Title Bar: Uses DraggableCard.Handle subcomponent to listen for pointer events and initiate dragging */}
        <DraggableCard.Handle className="bg-layout-bg border-b border-default px-4 py-2.5 flex items-center relative">

          <div className="flex gap-1.5 absolute left-4">
            <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-black/10" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-black/10" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-black/10" />
          </div>

          <h1 className="text-sm font-bold w-full text-center pl-14 pr-14 truncate text-text-secondary">
            {title}
          </h1>
        </DraggableCard.Handle>

        <div className="p-4 flex flex-col h-full">
          {children}
        </div>
      </div>
    </DraggableCard>
  );
}
