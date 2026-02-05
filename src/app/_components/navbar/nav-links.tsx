"use client";

import Link from "next/link";
import * as motion from "motion/react-client";
import { useNav } from "./_hooks/useNav";

export function NavLinks() {
  const { navTabs, selectedNavTab } = useNav();

  return (
    <div className="hidden flex-1 md:flex text-xl xl:text-2xl justify-around items-center">
      {navTabs.map((tab) => (
        <Link
          key={tab.title}
          href={tab.href}
          className="
           flex justify-center items-center 
           h-full my-3 relative z-10 px-5
           hover:bg-gray-100 transition-colors"
        >
          {tab.title}
          {selectedNavTab?.title === tab.title && (
            <motion.div
              layoutId="printBrackets"
              className="
               flex
               absolute inset-0 h-full items-center
               pointer-events-none"
              transition={{
                type: "spring",
                duration: 0.4,
                bounce: 0.2,
              }}
            >
              <span className="hidden lg:block absolute -left-16 xl:-left-19">
                print
              </span>
              <span>(</span>
              <div className="flex-1"></div>
              <span>)</span>
            </motion.div>
          )}
        </Link>
      ))}
    </div>
  );
}
