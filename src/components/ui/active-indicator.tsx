"use client";

import { useLayoutEffect, useState } from "react";
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
  const [position, setPosition] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    const updatePosition = () => {
      const selectedEl = itemRefs.current[selectedIndex];

      if (selectedEl) {
        setPosition({
          left: selectedEl.offsetLeft,
          width: selectedEl.offsetWidth,
        });
      } else {
        setPosition(null);
      }
    };

    updatePosition();

    // Font loading and container changes can move links without a window resize.
    const observer = new ResizeObserver(updatePosition);
    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });
    const parent = itemRefs.current.find((item) => item)?.parentElement;
    if (parent) observer.observe(parent);

    window.addEventListener("resize", updatePosition);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePosition);
    };
  }, [selectedIndex, itemRefs]);

  // Mount at the measured position so the first paint does not animate from zero.
  if (!position) return null;

  return (
    <div
      className={cn(
        "absolute pointer-events-none transition-[left,width] duration-400 ease-out",
        className
      )}
      style={position}
      {...props}
    >
      {children}
    </div>
  );
}
