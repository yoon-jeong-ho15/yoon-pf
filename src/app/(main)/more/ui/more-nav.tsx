"use client";

import Link from "next/link";
import Logout from "./logout";
import Alert from "./alert";
import * as motion from "motion/react-client";
import { usePathname } from "next/navigation";
import { robotoMono } from "@/app/fonts";

export default function MoreNav() {
  const pathname = usePathname();
  const selectedTab = tabs.find((tab) => tab.href === pathname);

  return (
    <nav
      className={`
        flex h-12 mt-3 mx-6 justify-between
        `}
    >
      <div
        className={`
        flex w-6/12 bg-amber-50
        `}
      >
        hello
      </div>
      <div
        className={`
          ${robotoMono.className} relative 
          w-6/12 flex justify-around text-xl
          border-gray-400 border-1 bg-gray-100
          rounded-2xl font-[500] text-shadow-xs/10
          shadow-lg`}
      >
        <div
          className="
        flex flex-grow h-full 
        items-center justify-around text-2xl
        "
        >
          {tabs.map((item) => (
            <MotionLink
              key={item.title}
              href={item.href}
              animate={{
                backgroundColor: item === selectedTab ? "#000" : "",
                color: item === selectedTab ? "#fff" : "",
              }}
              className="relative rounded px-2 py-1"
            >
              <span className="z-10 bg-inherit">{item.title}</span>
              {/* {selectedTab === item && (
              <motion.div
                layoutId="tsx"
                transition={{ type: "spring", duration: 0.4, bouncd: 0.05 }}
                className="absolute -right-10 bottom-0 text-black"
              >
                .tsx
              </motion.div>
            )} */}
            </MotionLink>
          ))}
        </div>
        <div
          className="
        absolute right-0
        flex flex-row h-full w-fit border-l
        border-gray-500 bg-gray-100 items-center px-2 z-10
        rounded-r-2xl
        "
        >
          <Alert />
          <Logout />
        </div>
      </div>
    </nav>
  );
}

const tabs = [
  {
    title: "profile",
    href: "/more",
  },
  {
    title: "chat",
    href: "/more/chat",
  },
];

const MotionLink = motion.create(Link);
