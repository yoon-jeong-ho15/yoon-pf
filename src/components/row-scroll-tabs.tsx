import { useScroll } from "@/hooks/useScroll";
import { useScrollToActive } from "@/hooks/useScrollToActive";

export default function RowScrollTabs({
  children,
  className,
  activeSelector,
}: {
  children: React.ReactNode;
  className?: string;
  activeSelector?: string | null;
}) {
  const scrollRef = useScroll<HTMLDivElement>();

  // activeSelector가 전달되면 해당 요소로 가로 스크롤 이동
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
