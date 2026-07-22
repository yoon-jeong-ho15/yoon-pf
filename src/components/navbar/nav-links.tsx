"use client";

import Link from "next/link";
import { useRef } from "react";
import { ActiveIndicator } from "../ui/active-indicator";
import { useNav } from "../../hooks/useNav";

export function NavLinks() {
  const { navTabs, selectedIndex } = useNav();
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  return (
    <div className="relative hidden flex-1 md:flex text-xl xl:text-2xl justify-around items-center">
      {navTabs.map((tab, i) => (
        <Link
          key={tab.title}
          href={tab.href}
          ref={(el) => { itemRefs.current[i] = el; }}
          className="
           flex justify-center items-center 
           h-full my-3 relative z-10 px-5"
        >
          {tab.title}
        </Link>
      ))}
      <ActiveIndicator
        itemRefs={itemRefs}
        selectedIndex={selectedIndex}
        className="flex items-center h-full"
      >
        <span className="hidden lg:block absolute -left-16 xl:-left-19">
          print
        </span>
        <span>(</span>
        <div className="flex-1"></div>
        <span>)</span>
      </ActiveIndicator>
    </div>
  );
}
