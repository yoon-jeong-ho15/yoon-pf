"use client";

import { useNav } from "../../hooks/useNav";
import { type AnimationEvent, useEffect, useId, useRef, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MobileMenuState = "closed" | "open" | "closing";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

function hasActiveAnimation(element: HTMLElement): boolean {
  const style = getComputedStyle(element);
  if (style.display === "none" || style.animationName === "none") {
    return false;
  }

  return style.animationDuration
    .split(",")
    .some((duration) => (Number.parseFloat(duration) || 0) > 0);
}

export function MobileMenu() {
  const { navTabs, selectedNavTab } = useNav();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [menuState, setMenuState] = useState<MobileMenuState>("closed");

  const isOpen = menuState === "open";
  const isOverlayRendered = menuState !== "closed";

  useEffect(() => {
    if (menuState !== "open") return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuState("closing");
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuState]);

  useEffect(() => {
    if (menuState === "closed") return;

    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    if (desktopQuery.matches) {
      setMenuState("closed");
      return;
    }

    const overlay = overlayRef.current;
    const handleAnimationCancel = (event: globalThis.AnimationEvent) => {
      if (event.target !== overlay) return;
      if (event.animationName && event.animationName !== "fadeOut") return;
      setMenuState((state) => (state === "closing" ? "closed" : state));
    };

    if (menuState === "closing" && overlay) {
      if (!hasActiveAnimation(overlay)) {
        setMenuState("closed");
        return;
      }
      overlay.addEventListener("animationcancel", handleAnimationCancel);
    }

    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuState("closed");
      }
    };

    desktopQuery.addEventListener("change", handleBreakpointChange);
    return () => {
      overlay?.removeEventListener("animationcancel", handleAnimationCancel);
      desktopQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [menuState]);

  const handleOverlayAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.animationName && event.animationName !== "fadeOut") return;
    setMenuState((state) => (state === "closing" ? "closed" : state));
  };

  return (
    <>
      <div className="">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMenuState((state) => (state === "open" ? "closing" : "open"))}
          className="p-2"
          aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isOpen}
          aria-controls={menuId}
        >
          <Bars3Icon className="size-6" />
        </button>
      </div>

      {isOverlayRendered && (
        <div
          ref={overlayRef}
          id={menuId}
          inert={!isOpen}
          className={cn(
            "md:hidden fixed inset-0 top-13 z-50 bg-black/30 overflow-hidden",
            isOpen ? "animate-fade-in" : "animate-fade-out",
          )}
          onClick={() => setMenuState("closing")}
          onAnimationEnd={handleOverlayAnimationEnd}
        >
          <div
            className={cn(
              "relative w-full bg-surface shadow-xl p-5",
              isOpen ? "animate-slide-down" : "animate-slide-up",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-5">
              {navTabs.map((tab) => (
                <Link
                  key={tab.title}
                  href={tab.href}
                  onClick={() => setMenuState("closing")}
                  className={cn(
                    "text-2xl text-center py-3 rounded-lg transition-colors",
                    selectedNavTab?.title === tab.title
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-hover-bg",
                  )}
                >
                  {tab.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
