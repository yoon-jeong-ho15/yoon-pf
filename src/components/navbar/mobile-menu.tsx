"use client";

import { useNav } from "../../hooks/useNav";
import { useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function MobileMenu() {
  const { navTabs, selectedNavTab } = useNav();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="">
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
            className="md:hidden fixed inset-0 top-13 z-50 bg-black/30 overflow-hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="
              relative w-full
              bg-gray-50 shadow-xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-5">
                {navTabs.map((tab) => (
                  <Link
                    key={tab.title}
                    href={tab.href}
                    onClick={() => setIsMenuOpen(false)}
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
