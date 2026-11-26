"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

// Module-scoped counter to assign an increasing z-index whenever a card is interacted with.
let globalZIndex = 10;

const DRAGGING_TRANSITION = "box-shadow 0.2s ease-out, opacity 0.2s ease-out, scale 0.2s ease-out";
const IDLE_TRANSITION = `transform 0.2s, ${DRAGGING_TRANSITION}`;

export interface CardPosition {
  x: number;
  y: number;
}

export interface CardRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface BoundaryRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface TranslationBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Computes valid translation bounds so a card stays within the given boundary rectangle.
 */
export function calculateTranslationBounds(
  cardRect: CardRect,
  currentOffset: CardPosition,
  boundaryRect: BoundaryRect,
): TranslationBounds {
  const originLeft = cardRect.left - currentOffset.x;
  const originTop = cardRect.top - currentOffset.y;

  const rawMinX = boundaryRect.left - originLeft;
  const rawMaxX = boundaryRect.right - originLeft - cardRect.width;
  const rawMinY = boundaryRect.top - originTop;
  const rawMaxY = boundaryRect.bottom - originTop - cardRect.height;

  // Normalize min/max order when the card is larger than its boundary.
  return {
    minX: Math.min(rawMinX, rawMaxX),
    maxX: Math.max(rawMinX, rawMaxX),
    minY: Math.min(rawMinY, rawMaxY),
    maxY: Math.max(rawMinY, rawMaxY),
  };
}

/**
 * Clamps a translation coordinate into the provided bounds.
 */
export function clampCardPosition(
  position: CardPosition,
  bounds: TranslationBounds,
): CardPosition {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, position.x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, position.y)),
  };
}

/**
 * Reads the card and active boundary (container element or viewport) rectangles from the DOM.
 */
function measureDragGeometry(
  cardElement: HTMLElement,
  containerSelector?: string,
): { cardRect: CardRect; boundaryRect: BoundaryRect } {
  const rect = cardElement.getBoundingClientRect();
  const container = containerSelector ? document.querySelector(containerSelector) : null;

  const cardRect: CardRect = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };

  if (container) {
    const containerRect = container.getBoundingClientRect();
    return {
      cardRect,
      boundaryRect: {
        left: containerRect.left,
        top: containerRect.top,
        right: containerRect.right,
        bottom: containerRect.bottom,
      },
    };
  }

  return {
    cardRect,
    boundaryRect: {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    },
  };
}

interface DraggableCardContextType {
  handlePointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  handleDoubleClick: () => void;
}

const DraggableCardContext = createContext<DraggableCardContextType | null>(null);

/**
 * Custom hook to consume the DraggableCardContext.
 * Ensures sub-components (such as DraggableCard.Handle) are rendered inside <DraggableCard>.
 */
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

/**
 * DraggableCard wraps children with pointer-based drag-and-drop behavior.
 * Translation offsets are stored in a ref and applied directly to the DOM via transform: translate3d
 * so pointer moves do not trigger React re-renders.
 */
export function DraggableCard({
  children,
  className,
  randomizePosition = false,
  containerSelector,
}: DraggableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(10);

  const cardRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<CardPosition>({ x: 0, y: 0 });
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  /**
   * Single path for reflecting card translation coordinates into positionRef and the DOM.
   */
  const applyCardPosition = useCallback((x: number, y: number) => {
    positionRef.current = { x, y };
    if (cardRef.current) {
      cardRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  /**
   * Measures the current DOM boundary and clamps a target translation coordinate into it.
   */
  const clampToBoundary = useCallback(
    (targetPosition: CardPosition, currentOffset: CardPosition = positionRef.current): CardPosition => {
      if (!cardRef.current) return targetPosition;

      const { cardRect, boundaryRect } = measureDragGeometry(cardRef.current, containerSelector);
      const bounds = calculateTranslationBounds(cardRect, currentOffset, boundaryRect);
      return clampCardPosition(targetPosition, bounds);
    },
    [containerSelector],
  );

  /**
   * Starts dragging from the handle on primary-button press outside interactive controls.
   */
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (target.closest("a, button, input, textarea, select")) {
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

    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.stopPropagation();
  }, []);

  /**
   * Applies unclamped 1:1 pointer displacement directly to the DOM without triggering React re-renders.
   */
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    applyCardPosition(
      dragStartRef.current.initialX + dx,
      dragStartRef.current.initialY + dy,
    );
  };

  /**
   * Ends the drag gesture, releases pointer capture, and clamps the card back within bounds.
   */
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;

    setIsDragging(false);
    const target = e.target as HTMLElement;
    if (target.hasPointerCapture?.(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }
    dragStartRef.current = null;

    const clamped = clampToBoundary(positionRef.current, positionRef.current);
    applyCardPosition(clamped.x, clamped.y);
  };

  /**
   * Resets card translation to (0, 0) on double-click.
   */
  const handleDoubleClick = useCallback(() => {
    applyCardPosition(0, 0);
  }, [applyCardPosition]);

  // Re-clamp card translation when the window resizes so it stays within container or viewport bounds.
  useEffect(() => {
    const handleResize = () => {
      const clamped = clampToBoundary(positionRef.current, positionRef.current);
      applyCardPosition(clamped.x, clamped.y);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [clampToBoundary, applyCardPosition]);

  // Initialize DOM transform (applying a clamped random offset in X: [-100, 99], Y: [-80, 79] if enabled).
  useEffect(() => {
    if (!randomizePosition) {
      applyCardPosition(positionRef.current.x, positionRef.current.y);
      return;
    }

    const randomX = Math.floor(Math.random() * 200) - 100;
    const randomY = Math.floor(Math.random() * 160) - 80;
    const clamped = clampToBoundary({ x: randomX, y: randomY }, { x: 0, y: 0 });
    applyCardPosition(clamped.x, clamped.y);
  }, [randomizePosition, clampToBoundary, applyCardPosition]);

  const contextValue = useMemo(
    () => ({
      handlePointerDown,
      handleDoubleClick,
    }),
    [handlePointerDown, handleDoubleClick],
  );

  return (
    <DraggableCardContext.Provider value={contextValue}>
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={() => {
          globalZIndex += 1;
          setZIndex(globalZIndex);
        }}
        style={{
          zIndex,
          transition: isDragging ? DRAGGING_TRANSITION : IDLE_TRANSITION,
        }}
        className={cn(
          "will-change-transform select-none",
          isDragging ? "shadow-2xl opacity-90 scale-[1.01]" : "",
          className,
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

/**
 * Drag handle subcomponent that composes consumer pointer/double-click handlers with card drag controls.
 */
export function DraggableCardHandle({
  children,
  className,
  onPointerDown,
  onDoubleClick,
  ...props
}: DraggableCardHandleProps) {
  const { handlePointerDown, handleDoubleClick } = useDraggableCard();

  return (
    <div
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (!event.defaultPrevented) handlePointerDown(event);
      }}
      onDoubleClick={(event) => {
        onDoubleClick?.(event);
        if (!event.defaultPrevented) handleDoubleClick();
      }}
      className={cn("touch-none cursor-grab active:cursor-grabbing select-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}

DraggableCard.Handle = DraggableCardHandle;
