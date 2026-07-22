import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  rootMargin: "0px 0px -80% 0px",
};

export function useScrollspy(
  selector: string,
  options?: IntersectionObserverInit,
) {
  const [activeId, setActiveId] = useState<string>("");
  const pathname = usePathname();

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      optionsRef.current || DEFAULT_OPTIONS
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, [selector, pathname]);

  return activeId;
}
