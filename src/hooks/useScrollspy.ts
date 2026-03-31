import { useState, useEffect } from "react";

export function useScrollspy(
  selector: string,
  options?: IntersectionObserverInit
) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, options || { rootMargin: "0px 0px -80% 0px" });

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
    // We omit options from the dependency array because passing an inline object would trigger an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector]);

  return activeId;
}
