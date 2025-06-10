"use client";

import Link from "next/link";
import { useState } from "react";
import { robotoMono } from "../fonts";
import * as motion from "motion/react-client";

export default function Navbar() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <nav
      className={`
       ${robotoMono.className}
       flex justify-around items-center 
       h-14 mt-8 mx-10 text-2xl shadow-lg
       border-gray-400 border-1 bg-gray-100
       rounded-3xl font-[500]
       overflow-hidden text-shadow-xs/10
       relative
     `}
    >
      {tabs.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          onClick={() => setSelectedTab(item)}
          className="
           flex justify-center items-center 
           h-full w-35 my-3 relative z-10"
        >
          {item.title}
          {selectedTab === item && (
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
    </nav>
  );
}

const tabs = [
  { title: "home", href: "/" },
  { title: "about", href: "/about" },
  { title: "more", href: "/more" },
];
