"use client";

import Link from "next/link";
import { robotoMono } from "@/app/fonts";
import * as motion from "motion/react-client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getSelectedTab = () => {
    if (pathname === "/") return tabs[0];
    if (pathname.startsWith("/about")) return tabs[1];
    if (pathname.startsWith("/blog")) return tabs[2];
    if (pathname.startsWith("/more")) return tabs[3];
  };
  const selectedTab = getSelectedTab();

  useEffect(() => {
    // Close the mobile menu when the route changes
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`
       ${robotoMono.className}
       flex justify-between items-center 
       h-14 w-auto mt-4 mx-4 md:mx-6 text-2xl shadow-lg
       border-gray-400 border-1 bg-gray-100
       rounded-2xl font-[500] text-shadow-xs/10
       md:justify-around
     `}
      >
        <div className="hidden md:flex justify-around items-center h-full w-full">
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
                  <span className="hidden md:block absolute -left-19">
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

        <div className="md:hidden ml-5 font-bold text-xl">
          <Link href={selectedTab?.href ?? "/"}>{selectedTab?.title}</Link>
        </div>

        <div className="md:hidden mr-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            <Bars3Icon className="size-6" />
          </button>
        </div>
      </nav>

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
                  {/* <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg> */}
                  <XMarkIcon className="size-6" />
                </button>
              </div>
              <div className="flex flex-col space-y-5">
                {tabs.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`text-2xl text-center py-3 rounded-lg transition-colors ${
                      selectedTab === item
                        ? "bg-gray-700 text-gray-200"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {item.title}
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

const tabs = [
  { title: "home", href: "/" },
  { title: "about", href: "/about" },
  { title: "blog", href: "/blog" },
  { title: "more", href: "/more" },
];
