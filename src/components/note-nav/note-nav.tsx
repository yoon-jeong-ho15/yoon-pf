"use client";

import { CategoryTree } from "@/types";
import { useNoteNav } from "../../hooks/useNoteNav";
import { useState, useEffect } from "react";
import NavContent from "./nav-content";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/outline";

interface NavigationProps {
  tree: CategoryTree[];
}

interface Props {
  tree: CategoryTree[];
  navState: ReturnType<typeof useNoteNav>;
}

export default function NoteNav({ tree }: NavigationProps) {
  const navState = useNoteNav(tree);

  return (
    <>
      <MobileNoteNav tree={tree} navState={navState} />
      <DesktopNoteNav tree={tree} navState={navState} />
    </>
  );
}

function MobileNoteNav({ tree, navState }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      const timeout = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden w-12 shrink-0 h-full absolute">
      <div className="sticky top-2 ml-2 mt-2">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1 flex items-center justify-center w-10 h-10 border border-default rounded bg-surface shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-focus-ring"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      {isMounted && (
        <>
          <div
            className={`fixed inset-y-0 right-0 left-12 z-30 bg-black/40 ${isOpen ? "animate-fade-in" : "animate-fade-out"}`}
            onClick={closeMenu}
          />

          <aside
            className={`fixed top-0 bottom-0 left-0 z-40 w-72 flex flex-col bg-surface shadow-xl shadow-black/10 border-r border-muted ${isOpen ? "animate-slide-right-in" : "animate-slide-right-out"}`}
          >
              <div className="flex pl-4 items-center ">
                <button onClick={closeMenu} className="p-1 h-10 w-10">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <NavContent tree={tree} {...navState} onLinkClick={closeMenu} />
          </aside>
        </>
      )}
    </div>
  );
}

export function DesktopNoteNav({ tree, navState }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-62 lg:w-72 bg-surface sticky top-0 max-h-screen border-r border-default">
      <NavContent tree={tree} {...navState} />
    </aside>
  );
}
