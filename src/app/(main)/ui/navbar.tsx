"use client";

import Link from "next/link";
import { robotoMono } from "@/app/fonts";
import * as motion from "motion/react-client";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const getSelectedTab = () => {
    if (pathname === "/") return tabs[0];
    if (pathname.startsWith("/about")) return tabs[1];
    if (pathname.startsWith("/blog")) return tabs[2];
    if (pathname.startsWith("/more")) return tabs[3];
  };
  const selectedTab = getSelectedTab();

  return (
    <nav
      className={`
       ${robotoMono.className}
       flex justify-around items-center 
       h-14 w-auto mt-4 mx-6 text-2xl shadow-lg
       border-gray-400 border-1 bg-gray-100
       rounded-2xl font-[500] text-shadow-xs/10
       overflow-hidden 
     `}
    >
      {tabs.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="
           flex justify-center items-center 
           h-full my-3 relative z-10 px-5"
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
  { title: "blog", href: "/blog" },
  { title: "more", href: "/more" },
];
