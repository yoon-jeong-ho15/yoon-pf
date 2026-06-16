"use client";

import React from "react";
import { DraggableCard } from "./draggable-card";
import { cn } from "@/lib/utils";

interface MacosCardProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  randomizePosition?: boolean;
  containerSelector?: string;
}

export function MacosCard({
  children,
  title,
  className,
  randomizePosition = false,
  containerSelector,
}: MacosCardProps) {
  return (
    <DraggableCard
      randomizePosition={randomizePosition}
      containerSelector={containerSelector}
      className={cn("w-full max-w-xl", className)}
    >
      <div className="bg-surface border border-default rounded-lg overflow-hidden flex flex-col shadow-md w-full h-full">
        {/* macOS Title Bar using the DraggableCard.Handle sub-component */}
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
        {/* Card Content */}
        <div className="p-4 flex flex-col h-full">
          {children}
        </div>
      </div>
    </DraggableCard>
  );
}
