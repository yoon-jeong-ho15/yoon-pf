"use client";
import { useScroll } from "@/hooks/useScroll";
import { useScrollToActive } from "@/hooks/useScrollToActive";

export default function ScrollableRow({
  children,
  className,
  activeSelector,
}: {
  children: React.ReactNode;
  className?: string;
  activeSelector?: string | null;
}) {
  const scrollRef = useScroll<HTMLDivElement>();

  useScrollToActive<HTMLDivElement>(
    activeSelector || null,
    { inline: "center", block: "nearest" },
    scrollRef,
  );

  return (
    <div ref={scrollRef} className={`flex overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
}
