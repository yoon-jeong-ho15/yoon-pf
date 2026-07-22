"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ActiveIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  selectedIndex: number;
}

export function ActiveIndicator({
  itemRefs,
  selectedIndex,
  className,
  children,
  ...props
}: ActiveIndicatorProps) {
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const selectedEl = itemRefs.current[selectedIndex];

      if (selectedEl) {
        setLeft(selectedEl.offsetLeft);
        setWidth(selectedEl.offsetWidth);
        setOpacity(1);
      } else {
        setOpacity(0);
      }
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [selectedIndex, itemRefs]);

  return (
    <div
      className={cn(
        "absolute pointer-events-none transition-all duration-400 ease-out",
        className
      )}
      style={{ left, width, opacity }}
      {...props}
    >
      {children}
    </div>
  );
}
