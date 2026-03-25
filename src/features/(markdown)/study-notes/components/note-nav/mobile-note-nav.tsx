"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/outline";
import { CategoryTree } from "@/types";
import NavContent from "./nav-content";
import { useNoteNav } from "./use-note-nav";

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
    <div className="md:hidden w-12 shrink-0 h-full border-r border-gray-200 bg-white">
      <div className="sticky top-0 z-50 flex h-12 items-center justify-center bg-white">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <CloseIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
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
              className="fixed top-0 bottom-0 left-12 z-40 w-72 flex flex-col divide-y bg-white shadow-xl shadow-black/10 border-r border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <NavContent tree={tree} {...navState} onLinkClick={closeMenu} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
