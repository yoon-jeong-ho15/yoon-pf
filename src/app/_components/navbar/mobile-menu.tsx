"use client";

import { useNav } from "./_hooks/useNav";
import { useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function MobileMenu() {
  const { navTabs, selectedNavTab } = useNav();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="md:hidden mr-4">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <Bars3Icon className="size-6" />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/30 z-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="
              absolute top-0 right-0 
              h-full w-4/5 max-w-xs 
              bg-gray-50 shadow-xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-6">
                <button onClick={() => setIsMenuOpen(false)} className="p-2">
                  <XMarkIcon className="size-6" />
                </button>
              </div>
              <div className="flex flex-col space-y-5">
                {navTabs.map((tab) => (
                  <Link
                    key={tab.title}
                    href={tab.href}
                    className={`text-2xl text-center py-3 rounded-lg transition-colors ${
                      selectedNavTab?.title === tab.title
                        ? "bg-gray-700 text-gray-200"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
