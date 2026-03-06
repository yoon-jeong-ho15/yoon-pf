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

    const activeElement = ref.current.querySelector(selector);
    if (activeElement) {
      activeElement.scrollIntoView({
        block: options?.block || "center",
        inline: options?.inline || "nearest",
      });
    }
  }, [selector, options?.block, options?.inline, ref]);

  return ref;
}
