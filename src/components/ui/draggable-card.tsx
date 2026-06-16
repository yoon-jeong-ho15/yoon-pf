"use client";

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

// Global module-scoped counter to track z-index layering for active cards.
let globalZIndex = 10;

interface DraggableCardContextType {
  handlePointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  handleDoubleClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const DraggableCardContext = createContext<DraggableCardContextType | null>(null);

export function useDraggableCard() {
  const context = useContext(DraggableCardContext);
  if (!context) {
    throw new Error("DraggableCard sub-components must be rendered within a <DraggableCard> parent.");
  }
  return context;
}

interface DraggableCardProps {
  children: React.ReactNode;
  className?: string;
  randomizePosition?: boolean;
  containerSelector?: string;
}

export function DraggableCard({
  children,
  className,
  randomizePosition = false,
  containerSelector,
}: DraggableCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(10);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Store position in a ref to keep resize listener callback clean and prevent constant re-binding
  const positionRef = useRef(position);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  // Function to clamp position relative to current element bounds and viewport/container
  const getClampedPosition = useCallback((newX: number, newY: number, currentPos = positionRef.current) => {
    if (!cardRef.current) return { x: newX, y: newY };

    const rect = cardRef.current.getBoundingClientRect();
    // Calculate the original position without translation offsets
    const origLeft = rect.left - currentPos.x;
    const origTop = rect.top - currentPos.y;

    const container = containerSelector ? document.querySelector(containerSelector) : null;
    let minX, maxX, minY, maxY;

    if (container) {
      const containerRect = container.getBoundingClientRect();
      minX = containerRect.left - origLeft;
      maxX = containerRect.right - origLeft - rect.width;
      minY = containerRect.top - origTop;
      maxY = containerRect.bottom - origTop - rect.height;
    } else {
      minX = -origLeft;
      maxX = window.innerWidth - origLeft - rect.width;
      minY = -origTop;
      maxY = window.innerHeight - origTop - rect.height;
    }

    // Handle edge case where card is wider/taller than the container
    const finalMinX = Math.min(minX, maxX);
    const finalMaxX = Math.max(minX, maxX);
    const finalMinY = Math.min(minY, maxY);
    const finalMaxY = Math.max(minY, maxY);

    return {
      x: Math.max(finalMinX, Math.min(finalMaxX, newX)),
      y: Math.max(finalMinY, Math.min(finalMaxY, newY)),
    };
  }, [containerSelector]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    // Only allow left-clicks/primary touches
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;

    // Skip dragging when clicking interactive elements
    if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("select")
    ) {
      return;
    }

    setIsDragging(true);
    globalZIndex += 1;
    setZIndex(globalZIndex);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: positionRef.current.x,
      initialY: positionRef.current.y,
    };

    target.setPointerCapture(e.pointerId);
    e.stopPropagation();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    const targetX = dragStartRef.current.initialX + dx;
    const targetY = dragStartRef.current.initialY + dy;

    // Get clamped positions
    const clamped = getClampedPosition(targetX, targetY);
    setPosition(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragStartRef.current = null;
  };

  // Reset to original position on double click of the handle
  const handleDoubleClick = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  // Keep the card on screen during window resize events
  useEffect(() => {
    const handleResize = () => {
      const currentPos = positionRef.current;
      const clamped = getClampedPosition(currentPos.x, currentPos.y, currentPos);
      setPosition(clamped);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [getClampedPosition]);

  // Randomize initial position on mount (client-side only to prevent hydration mismatches)
  useEffect(() => {
    if (randomizePosition) {
      // Displacement ranges: X: [-100, 100] px, Y: [-80, 80] px
      const randomX = Math.floor(Math.random() * 200) - 100;
      const randomY = Math.floor(Math.random() * 160) - 80;
      const clamped = getClampedPosition(randomX, randomY, { x: 0, y: 0 });
      setPosition(clamped);
    }
  }, [randomizePosition, getClampedPosition]);

  const contextValue = React.useMemo(() => ({
    handlePointerDown,
    handleDoubleClick,
  }), [handlePointerDown, handleDoubleClick]);

  return (
    <DraggableCardContext.Provider value={contextValue}>
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          zIndex: zIndex,
          touchAction: "none", // Avoid scrolling browser view on mobile while dragging
        }}
        className={cn(
          "will-change-transform select-none transition-shadow duration-200 ease-out",
          isDragging ? "shadow-2xl opacity-90 scale-[1.01]" : "",
          className
        )}
      >
        {children}
      </div>
    </DraggableCardContext.Provider>
  );
}

interface DraggableCardHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DraggableCardHandle({ children, className, ...props }: DraggableCardHandleProps) {
  const { handlePointerDown, handleDoubleClick } = useDraggableCard();

  return (
    <div
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      className={cn("cursor-grab active:cursor-grabbing select-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Assign sub-component for namespaced usage: <DraggableCard.Handle>
DraggableCard.Handle = DraggableCardHandle;
