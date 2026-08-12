"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Cog6ToothIcon, SunIcon, MoonIcon, ComputerDesktopIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function OptionsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className="relative flex items-center" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-hover-bg transition-colors"
        aria-label="Options"
      >
        <Cog6ToothIcon className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 p-4 rounded-xl shadow-lg border border-default bg-surface w-64 animate-slide-down">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Options</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-hover-bg rounded-md">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary mb-2">Theme</p>
              <div className="flex bg-layout-bg rounded-lg p-1 border border-muted gap-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 flex justify-center py-1.5 rounded-md text-sm ${theme === 'light' ? 'bg-surface shadow-sm border border-default' : 'text-text-muted hover:text-foreground'}`}
                  aria-label="Light Theme"
                >
                  <SunIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 flex justify-center py-1.5 rounded-md text-sm ${theme === 'dark' ? 'bg-surface shadow-sm border border-default' : 'text-text-muted hover:text-foreground'}`}
                  aria-label="Dark Theme"
                >
                  <MoonIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex-1 flex justify-center py-1.5 rounded-md text-sm ${theme === 'system' ? 'bg-surface shadow-sm border border-default' : 'text-text-muted hover:text-foreground'}`}
                  aria-label="System Theme"
                >
                  <ComputerDesktopIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
