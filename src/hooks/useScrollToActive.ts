import { useEffect, useRef, RefObject } from "react";

export function useScrollToActive<T extends HTMLElement = HTMLElement>(
  selector: string | null,
  options?: { block?: ScrollLogicalPosition; inline?: ScrollLogicalPosition },
  externalRef?: RefObject<T | null>,
) {
  const internalRef = useRef<T>(null);
  const ref = externalRef || internalRef;

  useEffect(() => {
    if (!ref.current || !selector) return;

    const container = ref.current;

    const scrollToActive = () => {
      const activeElement = container.querySelector(selector);
      if (activeElement) {
        requestAnimationFrame(() => {
          activeElement.scrollIntoView({
            block: options?.block || "center",
            inline: options?.inline || "nearest",
            behavior: "smooth", // optional, but standard "smooth" or "instant"
          });
        });
      }
    };

    // Run on initial load
    scrollToActive();

    // Set up MutationObserver to scroll whenever class/attributes or children change
    const observer = new MutationObserver(() => {
      scrollToActive();
    });

    observer.observe(container, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [selector, options?.block, options?.inline, ref]);

  return ref;
}
