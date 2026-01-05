"use client";

import Link from "next/link";
import * as motion from "motion/react-client";
import { useNav } from "./_hooks/useNav";

export function NavLinks() {
  const { navTabs, selectedNavTab } = useNav();

  return (
    <div className="hidden md:flex justify-around items-center h-full w-full">
      {navTabs.map((tab) => (
        <Link
          key={tab.title}
          href={tab.href}
          className="
           flex justify-center items-center 
           h-full my-3 relative z-10 px-5"
        >
          {tab.title}
          {selectedNavTab?.title === tab.title && (
            <motion.div
              layoutId="printBrackets"
              className="
               absolute inset-0 h-full flex items-center
               pointer-events-none"
              transition={{
                type: "spring",
                duration: 0.4,
                bounce: 0.2,
              }}
            >
              <span className="hidden md:block absolute -left-19">print</span>
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
