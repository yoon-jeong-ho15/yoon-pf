import { useEffect, useRef } from "react";

export function useSwipeScroll<T extends HTMLElement = HTMLElement>() {
  const scrollRef = useRef<T>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Swipe scroll logic
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const handleStart = (clientX: number) => {
      isDragging = true;
      startX = clientX;
      startScrollLeft = el.scrollLeft;
    };

    const handleMove = (clientX: number, e: Event) => {
      if (!isDragging) return;
      e.preventDefault();
      const deltaX = clientX - startX;
      // swiping right (deltaX > 0) scrolls up (decreases scrollLeft)
      // swiping left (deltaX < 0) scrolls down (increases scrollLeft)
      el.scrollLeft = startScrollLeft - deltaX;
    };

    const handleEnd = () => {
      isDragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e);
    };

    const onMouseUp = () => {
      handleEnd();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleStart(e.touches[0].clientX);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e);
      }
    };

    el.addEventListener("mousedown", onMouseDown);

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", handleEnd);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", handleEnd);
    };
  }, []);

  return scrollRef;
}
