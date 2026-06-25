"use client";

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

// Global, module-scoped counter used to track and dynamically update the z-index depth of cards.
// Each time a card is clicked/dragged, this value is incremented and assigned to that card's state,
// ensuring the most recently interacted card always sits on top of all other cards.
let globalZIndex = 10;

// Type definition for the Context shared between DraggableCard and its DraggableCardHandle subcomponents.
interface DraggableCardContextType {
  handlePointerDown: (e: React.PointerEvent<HTMLElement>) => void; // Initiates the dragging process
  handleDoubleClick: (e: React.MouseEvent<HTMLElement>) => void;   // Resets the card position
}

// React Context to transmit pointer handlers down the component tree without prop-drilling.
const DraggableCardContext = createContext<DraggableCardContextType | null>(null);

/**
 * Custom hook to consume the DraggableCardContext.
 * Ensures that sub-components (like DraggableCard.Handle) are only used inside a parent <DraggableCard> component.
 */
export function useDraggableCard() {
  const context = useContext(DraggableCardContext);
  if (!context) {
    throw new Error("DraggableCard sub-components must be rendered within a <DraggableCard> parent.");
  }
  return context;
}

// Props interface for the main DraggableCard component
interface DraggableCardProps {
  children: React.ReactNode;          // Nested elements inside the card
  className?: string;                 // Custom styling classes for the outer card wrapper
  randomizePosition?: boolean;        // If true, the card mounts with a random translation offset
  containerSelector?: string;         // Optional CSS selector to restrict dragging within a specific element boundary
}

/**
 * DraggableCard component wraps children and provides full drag-and-drop capability.
 * Positions are tracked in React state and applied via inline translation (transform: translate3d).
 */
export function DraggableCard({
  children,
  className,
  randomizePosition = false,
  containerSelector,
}: DraggableCardProps) {
  // 1. Component State
  // { x, y } represents the current translation offsets (in pixels) relative to the card's original position.
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // isDragging represents whether the card is currently being actively dragged by the user.
  const [isDragging, setIsDragging] = useState(false);
  // zIndex represents the stack layering level for this individual card.
  const [zIndex, setZIndex] = useState(10);
  
  // 2. Refs
  // Reference to the outermost card element. Essential for computing bounding client rects.
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Store the position in a ref to always have access to the latest values inside callbacks (like window resize events)
  // without needing to re-bind or recreate those event listener functions on every render.
  const positionRef = useRef(position);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Stores drag start coordinates (startX, startY) and initial card translation offset (initialX, initialY) when dragging begins.
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  /**
   * Helper function to clamp the proposed {newX, newY} translations so the card stays within the bounds
   * of the specified container, or the viewport if no container is provided.
   */
  const getClampedPosition = useCallback((newX: number, newY: number, currentPos = positionRef.current) => {
    if (!cardRef.current) return { x: newX, y: newY };

    // Get the card's active screen rectangle
    const rect = cardRef.current.getBoundingClientRect();
    
    // Compute the card's original layout position (top-left offset) without the current translate3d offset applied.
    const origLeft = rect.left - currentPos.x;
    const origTop = rect.top - currentPos.y;

    // Check if a container selector was provided and if the element exists in the DOM.
    const container = containerSelector ? document.querySelector(containerSelector) : null;
    let minX, maxX, minY, maxY;

    if (container) {
      // Limit movements within the container boundary
      const containerRect = container.getBoundingClientRect();
      minX = containerRect.left - origLeft; // Left boundary limit
      maxX = containerRect.right - origLeft - rect.width; // Right boundary limit (accounting for card width)
      minY = containerRect.top - origTop; // Top boundary limit
      maxY = containerRect.bottom - origTop - rect.height; // Bottom boundary limit (accounting for card height)
    } else {
      // Limit movements within the browser viewport boundary
      minX = -origLeft; // Viewport left edge
      maxX = window.innerWidth - origLeft - rect.width; // Viewport right edge (accounting for card width)
      minY = -origTop; // Viewport top edge
      maxY = window.innerHeight - origTop - rect.height; // Viewport bottom edge (accounting for card height)
    }

    // Edge case handling: If the card is wider or taller than its container/viewport,
    // ensure min and max limits are in the correct order to prevent clamping math from breaking.
    const finalMinX = Math.min(minX, maxX);
    const finalMaxX = Math.max(minX, maxX);
    const finalMinY = Math.min(minY, maxY);
    const finalMaxY = Math.max(minY, maxY);

    // Return the coordinate clamped between the calculated min and max limits
    return {
      x: Math.max(finalMinX, Math.min(finalMaxX, newX)),
      y: Math.max(finalMinY, Math.min(finalMaxY, newY)),
    };
  }, [containerSelector]);

  /**
   * Pointer down event handler (triggered by clicking/touching the handle).
   * Initiates dragging, increments zIndex, and captures pointer events to the target element.
   */
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    // Only allow left-clicks (mouse button 0) or touch gestures. Ignore right-clicks.
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;

    // Do not initiate dragging if the user clicks an interactive element inside the handle area
    if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("select")
    ) {
      return;
    }

    // Set dragging state to true
    setIsDragging(true);
    // Bring this card to the front layer by incrementing global z-index
    globalZIndex += 1;
    setZIndex(globalZIndex);

    // Record the pointer starting coordinates and the card's current offset position
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: positionRef.current.x,
      initialY: positionRef.current.y,
    };

    // Capture pointer events on the target element so dragging works even if the pointer moves outside the card boundary
    target.setPointerCapture(e.pointerId);
    // Prevent event from bubbling up to parents
    e.stopPropagation();
  }, []);

  /**
   * Pointer move handler attached to the outer card wrapper.
   * Tracks delta movement from starting coordinates and updates card's position state.
   */
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;

    // Calculate mouse displacement (delta X, delta Y)
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    // Calculate new proposed positions
    const targetX = dragStartRef.current.initialX + dx;
    const targetY = dragStartRef.current.initialY + dy;

    // Clamp the proposed position within boundaries and update position state
    const clamped = getClampedPosition(targetX, targetY);
    setPosition(clamped);
  };

  /**
   * Pointer up handler. Ends the drag gesture and releases pointer capture.
   */
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    // Release pointer capture so standard hover/click states resume
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragStartRef.current = null;
  };

  /**
   * Reset card position to (0, 0) upon double-clicking the drag handle.
   */
  const handleDoubleClick = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  // Effect hook: Listens for window resize events to keep the card within viewport bounds.
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

  // Effect hook: Randomizes position within a specific boundary range when component mounts.
  useEffect(() => {
    if (randomizePosition) {
      // Pick random displacement values in range X: [-100, 100], Y: [-80, 80]
      const randomX = Math.floor(Math.random() * 200) - 100;
      const randomY = Math.floor(Math.random() * 160) - 80;
      // Clamp the random position so it is fully visible, then set state
      const clamped = getClampedPosition(randomX, randomY, { x: 0, y: 0 });
      setPosition(clamped);
    }
  }, [randomizePosition, getClampedPosition]);

  // Memoize context value to prevent unnecessary re-renders of DraggableCardHandle subcomponents.
  const contextValue = React.useMemo(() => ({
    handlePointerDown,
    handleDoubleClick,
  }), [handlePointerDown, handleDoubleClick]);

  return (
    <DraggableCardContext.Provider value={contextValue}>
      {/* Outer wrapper: renders card at the active coordinate translation using transform */}
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp} // Triggers pointer up on sudden event cancelations (like window blur)
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          zIndex: zIndex,
          touchAction: "none", // Critical: prevents mobile devices from scrolling the page while dragging the card
        }}
        className={cn(
          "will-change-transform select-none transition-shadow duration-200 ease-out",
          // Apply extra visual feedback (heavy shadow, scale up, slight opacity drop) while dragging
          isDragging ? "shadow-2xl opacity-90 scale-[1.01]" : "",
          className
        )}
      >
        {children}
      </div>
    </DraggableCardContext.Provider>
  );
}

// Props interface for the DraggableCardHandle component
interface DraggableCardHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Subcomponent DraggableCardHandle acts as the click-and-drag trigger.
 * Connects to pointer/double-click handlers supplied by DraggableCard context.
 */
export function DraggableCardHandle({ children, className, ...props }: DraggableCardHandleProps) {
  // Retrieve the pointer event handlers from the context
  const { handlePointerDown, handleDoubleClick } = useDraggableCard();

  return (
    <div
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      className={cn("cursor-grab active:cursor-grabbing select-none", className)} // Changes cursor style on hover/drag
      {...props}
    >
      {children}
    </div>
  );
}

// Assigns DraggableCardHandle to sub-property namespace to support `<DraggableCard.Handle>` syntax.
DraggableCard.Handle = DraggableCardHandle;
