import { useEffect, useRef } from "react";

export function useSwipeScroll<T extends HTMLElement = HTMLElement>() {
  const scrollRef = useRef<T>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Wheel scroll logic (vertical wheel -> horizontal scroll)
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: "instant",
      });
    };

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

    const onMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e);
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

    el.addEventListener("wheel", onWheel);
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", handleEnd);

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", handleEnd);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", handleEnd);

      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", handleEnd);
    };
  }, []);

  return scrollRef;
}
