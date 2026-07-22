"use client";

import { useNav } from "../../hooks/useNav";
import { useState } from "react";
import { useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const { navTabs, selectedNavTab } = useNav();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMounted(true);
    } else {
      const timeout = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isMenuOpen]);

  return (
    <>
      <div className="">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <Bars3Icon className="size-6" />
        </button>
      </div>

      {isMounted && (
        <div
          className={cn(
            "md:hidden fixed inset-0 top-13 z-50 bg-black/30 overflow-hidden",
            isMenuOpen ? "animate-fade-in" : "animate-fade-out"
          )}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={cn(
              "relative w-full bg-surface shadow-xl p-5",
              isMenuOpen ? "animate-slide-down" : "animate-slide-up"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-5">
              {navTabs.map((tab) => (
                <Link
                  key={tab.title}
                  href={tab.href}
                  onClick={() => setIsMenuOpen(false)}
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
