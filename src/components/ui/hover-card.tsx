"use client";

import { useState, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

interface HoverCardProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function HoverCard({ children, content, className = "", as: Component = "span" }: HoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const wrapperRef = useRef<HTMLElement>(null);

  const handleMouseEnter = () => {
    if (wrapperRef.current) {
      setRect(wrapperRef.current.getBoundingClientRect());
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (!content) {
    return <>{children}</>;
  }

  return (
    <>
      <Component
        ref={wrapperRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative inline-block ${className}`}
      >
        {children}
      </Component>
      {isHovered && rect && createPortal(
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: Math.min(rect.bottom + 8, window.innerHeight - 200),
            left: Math.max(
              0,
              Math.min(rect.left + rect.width / 2, window.innerWidth - 130),
            ),
            transform: "translateX(-50%)",
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}
