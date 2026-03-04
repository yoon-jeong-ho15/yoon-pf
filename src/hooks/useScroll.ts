import { useEffect, useRef } from "react";

export function useScroll<T extends HTMLElement = HTMLElement>() {
  const scrollRef = useRef<T>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: "instant",
      });
    };

    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return scrollRef;
}
