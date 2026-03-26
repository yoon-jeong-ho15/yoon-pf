"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/outline";
import { CategoryTree } from "@/types";
import NavContent from "./nav-content";
import { useNoteNav } from "../../hooks/use-note-nav";

interface Props {
  tree: CategoryTree[];
  navState: ReturnType<typeof useNoteNav>;
}

export default function MobileNoteNav({ tree, navState }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden w-12 shrink-0 h-full absolute">
      <div className="sticky top-2 ml-2 mt-2">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1 flex items-center justify-center w-10 h-10 border rounded bg-surface shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Toggle Menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 right-0 left-12 z-30 bg-black/40"
              onClick={closeMenu}
            />

            <motion.aside
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 bottom-0 left-0 z-40 w-72 flex flex-col divide-y bg-white shadow-xl shadow-black/10 border-r border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex pl-4 items-center ">
                <button onClick={closeMenu} className="p-1 h-10 w-10">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <NavContent tree={tree} {...navState} onLinkClick={closeMenu} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
