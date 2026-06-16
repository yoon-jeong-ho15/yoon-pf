import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useScrollspy(
  selector: string,
  options?: IntersectionObserverInit,
) {
  const [activeId, setActiveId] = useState<string>("");
  const pathname = usePathname();
  
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, optionsRef.current || { rootMargin: "0px 0px -80% 0px" });

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, [selector, pathname]);

  return activeId;
}
